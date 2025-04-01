import supabase from '@/services/supabase'
import { useTelegram } from '@/services/telegram'
import { useUserStore } from '@/stores/score'

const { user } = useTelegram()

const MY_ID = user?.id ?? 4252

export async function fetchTasks() {
  const { data } = await supabase.from('tasks').select('*')
  return data
}

// Получение пользователя из базы данных

export async function getOrCreateUser() {
  const pontentialUser = await supabase
    .from('users')
    .select()
    .eq('telegram', MY_ID)

  if (pontentialUser.data.length !== 0) {
    return pontentialUser.data[0]
  }

  const newUser = {
    telegram: MY_ID,
    friends: {},
    tasks: {},
    games: {},
    stars: 0,
    money: 500000,
    earnedStars: 0,
    checkin: 0,
    frozenMoney: 0,
  }

  await supabase.from('users').insert(newUser)
  return newUser
}

// Обновление денег и звезд пользователя в базе данных

export async function updateMoney(money) {
  await supabase.from('users').update({ money }).eq('telegram', MY_ID)
}

export async function updateFrozenMoney(frozenMoney) {
  await supabase.from('users').update({ frozenMoney }).eq('telegram', MY_ID)
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