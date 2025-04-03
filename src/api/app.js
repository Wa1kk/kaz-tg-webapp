import supabase from '@/services/supabase'
import { useTelegram } from '@/services/telegram'
import { useUserStore } from '@/stores/score'

const { user } = useTelegram()

const MY_ID = user?.id ?? 1
const userName = user?.username ?? 'error'
const userFirstName = user?.first_name ?? 'Пользователь'

// Получение списка всех тасков из бд
export async function fetchTasks() {
  const { data } = await supabase.from('tasks').select('*')
  return data
}

// Получение пользователя из бд перед заходом
export async function getOrCreateUser() {
  const pontentialUser = await supabase
    .from('users')
    .select()
    .eq('telegram', MY_ID)

  // Если пользователь уже есть в бд, то обновляем измененные данные при заходе
  if (pontentialUser.data.length !== 0) {

    // Если пользователь поменял тэг, то обновляем его в бд
    if (pontentialUser.data.username !== userName) {
      await supabase.from('users').update({ first_name: userName }).eq('telegram', MY_ID)
    }

    // Если пользователь поменял имя, то обновляем его в бд
    if (pontentialUser.data.first_name !== userFirstName) {
      await supabase.from('users').update({ first_name: userFirstName }).eq('telegram', MY_ID)
    }

    return pontentialUser.data[0]
  }

  // Если пользователь новый, то создаем его в бд
  const newUser = {
    telegram: MY_ID,
    username: userName,
    first_name: userFirstName,
    friends: {},
    tasks: {},
    games: {},
    stars: 0,
    money: 500000,
    earnedStars: 0,
    checkin: 0,
  }

  await supabase.from('users').insert(newUser)
  return newUser
}

// Подписка на изменения money
const channel = supabase
  .channel('user-money-updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'users',
      filter: `telegram=eq.${MY_ID}`
    },
    (payload) => {
      if (payload.new.money !== payload.old?.money) {
        const userStore = useUserStore()
        userStore.setMoney(payload.new.money)
      }
    }
  )
  .subscribe()

  // Если пользователь прошел игру, то обновляем ее в бд
  export async function markGameAsCompleted(gameId) {
    const { data } = await supabase
      .from('users')
      .select('games')
      .eq('telegram', MY_ID)
      .single()

    const games = data?.games || {}

    games[gameId] = true

    await supabase
      .from('users')
      .update({ games })
      .eq('telegram', MY_ID)
  }

  // Получение количества пройденных игр
  export async function getCompletedGamesCount() {
    const { data } = await supabase
      .from('users')
      .select('games')
      .eq('telegram', MY_ID)
      .single()

    const games = data?.games || {}  
    return Object.keys(games).length
  }

  // Функции для обновления значений пользователя в бд
  export async function updateMoney(money) {
    await supabase.from('users').update({ money }).eq('telegram', MY_ID)
  }

  export async function updateStars(stars) {
    await supabase.from('users').update({ stars }).eq('telegram', MY_ID)
  }

  export async function updateEarnedStars(earnedStars) {
    await supabase.from('users').update({ earnedStars }).eq('telegram', MY_ID)
  }

  export async function updateCheckin(checkin) {
    await supabase.from('users').update({ checkin }).eq('telegram', MY_ID)
  }

  export async function registerRef(userName, refId) {
    const { data } = await supabase.from('users').select().eq('telegram', +refId)

    const refUser = data[0]

    await supabase
      .from('users')
      .update({
        friends: { ...refUser.friends, [MY_ID]: userName },
        stars: refUser.stars + 50,
      })
      .eq('telegram', +refId)
  }

  export async function completeTask(user, task) {
    const userStore  = useUserStore()
    const newStars = userStore.stars + task.amount
    userStore.setStars(newStars)

    await supabase
      .from('users')
      .update({
        tasks: { ...user.tasks, [task.id]: true },
        stars: newStars,
      })
      .eq('telegram', MY_ID)
  }