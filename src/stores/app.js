import {
  getOrCreateUser,
  registerRef,
  fetchTasks,
  completeTask,
} from '@/api/app'
import { defineStore } from 'pinia'
import { useUserStore } from './score'
import { useTelegram } from '@/services/telegram'

const { user } = useTelegram();

export const useAppStore = defineStore('app', {
  state: () => ({
    user: {},
    tasks: [],
  }),
  actions: {
    async init(ref) {
      this.user = await getOrCreateUser()

      const userStore = useUserStore()
      userStore.setStars(this.user.stars)
      userStore.setMoney(this.user.money)
      userStore.setFrozenMoney(this.user.frozenMoney)
      userStore.setEarnedStars(this.user.earnedStars)
      userStore.setCheckin(this.user.checkin)

      if (ref && +ref !== +this.user.telegram) {
        await registerRef(user.first_name, ref)
      }
    },
    async completeTask(task) {
      await completeTask(this.user, task)
    },
    async fetchTasks() {
      this.tasks = await fetchTasks()
    },
  },
})