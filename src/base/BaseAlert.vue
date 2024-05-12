<template>
  <div>
    <Transition
      enter-active-class="animate__animated animate__bounceInRight"
      leave-active-class="animate__animated animate__bounceOutRight"
    >
      <div
        class="base-alert-component w-80 fixed top-2 right-2"
        v-if="props.messages && props.messages.length > 0"
      >
        <div
          class="border-l-2 px-3 py-5 text-xs relative my-1"
          :class="getAlertBackground(message.type)"
          v-for="message in props.messages"
          :key="message.type"
        >
          <div class="flex items-cener">
            <div class="flex items-center">
              <unicon
                :name="getMessageIcon(message.type)"
                :fill="getTextClass(message.type)"
                height="15"
              ></unicon>
              <p :style="`color: ${getTextClass(message.type)}`" class="font-semibold ml-2">
                {{ message.message }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  messages: Array
})

const getAlertBackground = (message) => {
  if (message === 'Error') {
    return 'bg-[#FDF1F5] border-l-[#CE2958]'
  } else if (message === 'Success') {
    return 'bg-[#EEFBF2] border-l-[#2D935A]'
  } else if (message === 'Warning') {
    return 'bg-[#FFF9EB] border-l-[#9E7124]'
  } else {
    return 'bg-[#F0FAFC] border-l-[#4AB1FE]'
  }
}

const getMessageIcon = (message) => {
  if (message === 'Error') {
    return 'times-circle'
  } else if (message === 'Success') {
    return 'check-circle'
  } else if (message === 'Warning') {
    return 'exclamation-octagon'
  } else {
    return 'info-circle'
  }
}
const getTextClass = (message) => {
  if (message === 'Error') {
    return '#CE2958'
  } else if (message === 'Success') {
    return '#2D935A'
  } else if (message === 'Warning') {
    return '#9E7124'
  } else {
    return '#4AB1FE'
  }
}
</script>

<style scoped></style>
