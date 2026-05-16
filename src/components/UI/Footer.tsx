import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full p-4 flex justify-center items-center pointer-events-none z-40 bg-gradient-to-t from-gray-950 to-transparent">
      <div className="flex items-center gap-2 text-gray-400/80 text-sm font-medium">
        <span>Made with</span>
        <Heart size={14} className="text-rose-500 animate-pulse fill-rose-500/50" />
        <span>by Rajpoot Money</span>
      </div>
    </footer>
  )
}
