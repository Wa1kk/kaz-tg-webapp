import { defineStore } from 'pinia'
import { updateStars, updateMoney, updateEarnedStars, updateCheckin } from '@/api/app'

export const useUserStore = defineStore('user', {
  state: () => ({
    stars: 0,
    money: 0,
    earnedStars: 0,
    checkin: 0,
    first_name: 'Пользователь',
  }),

  actions: {
    // Для звёзд
    addStars(amount = 1) {
      this.stars += amount
      updateStars(this.stars)
    },
    minusStars(amount = 1) {
      this.stars -= amount
      updateStars(this.stars)
    },
    setStars(amount) {
      this.stars = amount
    },

    // Для денег
    addMoney(amount = 1) {
      this.money += amount
      updateMoney(this.money)
    },
    minusMoney(amount = 1) {
      this.money -= amount
      updateMoney(this.money)
    },
    setMoney(amount) {
      this.money = amount
    },

    // Для earned
    addEarnedStars(amount = 1) {
      this.earnedStars += amount
      updateEarnedStars(this.earnedStars)
    },
    setEarnedStars(amount = 1) {
      this.earnedStars = amount
    },

    // Для checkin
    addCheckin(amount = 1) {
      this.checkin += amount
      updateCheckin(this.checkin)
    },
    setCheckin(amount = 1) {
      this.checkin = amount
    },

    // Для first_name
    setFirstName(amount = 'Пользователь') {
      this.first_name = amount
    }
  }
})
