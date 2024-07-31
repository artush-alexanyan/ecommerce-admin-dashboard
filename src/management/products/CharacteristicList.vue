<template>
  <div class="characteristics">
    <ul>
      <li
        v-for="(character, index) in characteristics"
        :key="index"
        class="my-1.5 text-base pb-2"
        :class="{ 'border-b border-b-gray-200': index !== characteristics.length - 1 }"
      >
        <div class="w-full flex items-center justify-between">
          <span>{{ character.title }}</span>
          <div class="flex items-center space-x-2">
            <span>{{ character.description }}</span>
            <button type="button" @click="emit('remove-characteristic', index)">
              <IconTimes :stroke="'red'" :icon-class="'h-4'" />
            </button>
          </div>
        </div>
      </li>
    </ul>
    <div class="new-character-form mb-5" v-if="showCharacteristics">
      <form @submit.prevent="emit('add-caracteristic')">
        <div class="grid grid-cols-2 gap-5">
          <div class="base-input">
            <label class="font-semibold"> Title </label>
            <input
              required
              type="text"
              :value="characterKey"
              @input="$emit('update:characterKey', $event.target.value)"
              class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
            />
          </div>
          <div class="base-input">
            <label class="font-semibold"> Description </label>
            <input
              required
              type="text"
              :value="characterValue"
              @input="$emit('update:characterValue', $event.target.value)"
              class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
            />
          </div>
        </div>
        <button type="submit" class="bg-green-600 text-white py-3.5 rounded-xl w-full mt-2.5">
          Save
        </button>
      </form>
    </div>
    <button
      @click="emit('toggle-characteristics')"
      type="button"
      class="bg-blue-600 text-white py-3.5 rounded-xl w-full"
    >
      {{ showCharacteristics ? 'Cancel' : 'Add Characteristic' }}
    </button>
  </div>
</template>

<script setup>
import IconTimes from '@/icons/IconTimes.vue'

const emit = defineEmits([
  'remove-characteristic',
  'add-caracteristic',
  'toggle-characteristics',
  'update:characterKey',
  'update:characterValue'
])

const props = defineProps({
  characteristics: Array,
  showCharacteristics: Boolean,
  characterKey: [String, Number],
  characterValue: [String, Number]
})
</script>
