<template>
  <div class="new-produsct">
    <Transition
      enter-active-class="animate__animated animate__fadeIn animate__faster"
      leave-active-class="animate__animated animate__fadeOut animate__faster"
    >
      <div
        v-if="showVariantEditPopup"
        class="fixed top-0 left-0 z-30 bg-black/50 w-full h-screen flex p-5 items-center justify-center"
      >
        <div class="bg-white p-5 rounded-[30px] md:min-w-[600px]">
          <div>
            <div class="flex items-center justify-between pb-5 border-b border-b-gray-200">
              <p class="text-xl font-semibold">Edit variant</p>
              <button type="button" @click="emit('close-variant-edit-popup')">
                <unicon name="times" fill="black"></unicon>
              </button>
            </div>
            <div class="variant" v-if="variant">
              <form @submit.prevent="emit('edit-variant-base-info')">
                <div class="">
                  <div class="grid grid-cols-2 gap-5">
                    <div class="flex flex-col">
                      <label class="mb-1.5">Price</label>
                      <input
                        required
                        placeholder="Title"
                        :value="variant.price"
                        @input="emit('update:price', $event.target.value)"
                        type="text"
                        class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                      />
                    </div>
                    <div class="flex flex-col">
                      <label class="mb-1.5">Price</label>
                      <input
                        required
                        placeholder="Title"
                        :value="variant.stock"
                        @input="emit('update:stock', $event.target.value)"
                        type="text"
                        class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                      />
                    </div>
                  </div>
                  <div class="characteristics mt-5">
                    <p class="mb-2.5">Characteristics</p>
                    <ul>
                      <li
                        class="flex items-center justify-between mb-1.5"
                        v-for="(characteristic, index) in variant.characteristics"
                        :key="index"
                      >
                        <div class="flex items-center space-x-5">
                          <span>{{ characteristic.title }}</span>
                          <span>{{ characteristic.description }}</span>
                        </div>
                        <button @click="emit('remove-character', index)" type="button">
                          <unicon name="times" fill="red"></unicon>
                        </button>
                      </li>
                      <div class="my-2.5">
                        <button
                          class="text-sm font-semibold text-green-600"
                          @click="emit('toggle-characters')"
                          type="button"
                        >
                          {{ showNewCharForm ? 'Cancel' : 'Add new' }}
                        </button>
                      </div>
                    </ul>
                    <form @submit.prevent="emit('add-new-character')" v-if="showNewCharForm">
                      <div class="grid grid-cols-2 gap-5 mt-5">
                        <div class="flex flex-col">
                          <label class="mb-1.5">Title</label>
                          <input
                            required
                            placeholder="Title"
                            :value="newCharTitle"
                            @input="emit('update:newCharTitle', $event.target.value)"
                            type="text"
                            class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                          />
                        </div>
                        <div class="flex flex-col">
                          <label class="mb-1.5">Description</label>
                          <input
                            required
                            placeholder="Description"
                            :value="newCharDescription"
                            @input="emit('update:newCharDescription', $event.target.value)"
                            type="text"
                            class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                          />
                        </div>
                      </div>
                      <button
                        class="bg-green-600 w-full text-white px-5 py-3.5 mt-5 rounded-xl"
                        type="submit"
                      >
                        Save
                      </button>
                    </form>
                  </div>
                </div>
                <button
                  :disabled="editing"
                  class="bg-blue-600 w-full text-white px-5 py-3.5 mt-5 rounded-xl"
                  type="submit"
                >
                  {{ editing ? 'Saving changes...' : 'Save changes' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div></Transition
    >
  </div>
</template>

<script setup>
const props = defineProps({
  showVariantEditPopup: Boolean,
  variant: Object,
  editing: Boolean,
  newCharTitle: [String, Number],
  newCharDescription: [String, Number],
  showNewCharForm: Boolean
})

const emit = defineEmits([
  'close-variant-edit-popup',
  'update:stock',
  'update:price',
  'edit-variant-base-info',
  'update:newCharDescription',
  'update:newCharTitle',
  'add-new-character',
  'remove-character',
  'toggle-characters'
])
</script>
