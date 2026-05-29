<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-padel-dark text-white font-sans flex flex-col">
    <!-- Navigation Bar -->
    <header class="sticky top-0 z-50 w-full glass-panel border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <RouterLink to="/" class="text-2xl font-extrabold tracking-wider text-padel-teal flex items-center gap-2">
              <img src="/favicon.png" alt="Padel48 Logo" class="w-8 h-8 object-contain rounded-md" />
              <span><span class="text-padel-red">PADEL</span>48</span>
              <span class="w-2.5 h-2.5 rounded-full bg-padel-red animate-pulse"></span>
            </RouterLink>
          </div>

          <!-- Navigation Links -->
          <nav class="hidden md:flex space-x-8">
            <RouterLink to="/" class="text-sm font-medium text-padel-gray hover:text-padel-teal transition-colors duration-200">
              Home
            </RouterLink>
            <RouterLink to="/courts" class="text-sm font-medium text-padel-gray hover:text-padel-teal transition-colors duration-200">
              Cari Lapangan
            </RouterLink>
            <RouterLink to="/booking" class="text-sm font-medium text-padel-gray hover:text-padel-teal transition-colors duration-200">
              Booking
            </RouterLink>
          </nav>

          <!-- Action Button -->
          <div class="flex items-center gap-4">
            <button class="px-4 py-1.5 rounded-full border border-padel-teal/30 hover:border-padel-teal text-padel-teal text-sm font-semibold transition-all duration-300 bg-padel-teal/5 hover:bg-padel-teal/10">
              Admin Hub
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-grow">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/5 py-6 bg-black/40">
      <div class="max-w-7xl mx-auto px-4 text-center text-xs text-padel-gray">
        &copy; 2026 Padel48 Hub. All rights reserved. Play with your favorite idols in a sporty way.
      </div>
    </footer>
  </div>
</template>

<style scoped>
.router-link-active {
  color: var(--color-padel-teal) !important;
  text-shadow: 0 0 8px rgba(102, 252, 241, 0.4);
}
</style>
