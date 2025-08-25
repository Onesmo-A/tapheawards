<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">Your Name</label>
      <input
        type="text"
        id="name"
        v-model="form.name"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
        placeholder="John Doe"
      />
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
      <input
        type="email"
        id="email"
        v-model="form.email"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
        placeholder="you@example.com"
      />
    </div>

    <div>
      <label for="message" class="block text-sm font-medium text-gray-700">Your Message</label>
      <textarea
        id="message"
        v-model="form.message"
        rows="4"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
        placeholder="Type your message here..."
      ></textarea>
    </div>

    <div>
      <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
      >
        Send Message
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  message: '',
})

function submitForm() {
  // Hapa unaweza kutumia axios au fetch kutuma data kwenda backend yako
  console.log('Form submitted:', form)

  // Futa fields baada ya kutuma
  form.name = ''
  form.email = ''
  form.message = ''
  alert('Thank you! Your message has been sent.')
}
</script>

<style scoped>
/* Optional: extra styles */
</style>
