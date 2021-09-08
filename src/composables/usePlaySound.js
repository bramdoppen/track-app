import { useSound } from '@vueuse/sound'
import successSound from '@/assets/sounds/success-bling.mp3'

export default {
	setup() {
    const { play } = useSound(successSound)

    return {
      play,
    }
  },
}