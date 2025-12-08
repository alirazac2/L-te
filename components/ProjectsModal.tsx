'use client'


import { useEffect } from 'react'

interface Project {
  title: string
  description: string
  tech: string[]
  url: string
  image: string
}

interface ProjectsModalProps {
  isOpen: boolean
  onClose: () => void
  projects: Project[]
  accentColor: string
}

export default function ProjectsModal({ isOpen, onClose, projects, accentColor }: ProjectsModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      
      <div 
        className="relative w-full sm:max-w-4xl max-h-[90vh] bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl rounded-t-3xl sm:rounded-2xl border-t border-x border-white/20 shadow-2xl animate-slide-up overflow-hidden"
      >
        {/* Drag Handle & Header - Swipeable Area */}
        <div 
          className="cursor-grab active:cursor-grabbing"
          onTouchStart={(e) => {
            const touch = e.touches[0]
            const startY = touch.clientY
            const modal = e.currentTarget.closest('[class*="relative"]') as HTMLElement
            let hasMoved = false
            
            const onTouchMove = (moveEvent: TouchEvent) => {
              const currentY = moveEvent.touches[0].clientY
              const diffY = currentY - startY
              
              // Only allow downward swipe
              if (diffY > 0) {
                hasMoved = true
                if (modal) {
                  moveEvent.preventDefault()
                  modal.style.transform = `translateY(${diffY}px)`
                  modal.style.opacity = `${1 - diffY / 300}`
                }
              }
            }
            
            const onTouchEnd = (endEvent: TouchEvent) => {
              const endY = endEvent.changedTouches[0].clientY
              const diffY = endY - startY
              
              if (hasMoved && diffY > 100 && modal) {
                onClose()
              } else if (modal) {
                modal.style.transform = ''
                modal.style.opacity = ''
              }
              
              document.removeEventListener('touchmove', onTouchMove)
              document.removeEventListener('touchend', onTouchEnd)
            }
            
            document.addEventListener('touchmove', onTouchMove, { passive: false })
            document.addEventListener('touchend', onTouchEnd)
          }}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1.5 bg-white/40 rounded-full" />
          </div>
          
          {/* Header */}
          <div className="px-6 pt-2 pb-4 border-b border-white/10">
            <h3 className="text-xl font-bold text-white">My Projects</h3>
            <p className="text-xs text-gray-400 mt-1">View my latest work ({projects.length})</p>
          </div>
        </div>
        
        {/* Projects Grid - Scrollable Area */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-150px)]" style={{ touchAction: 'pan-y' }}>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden shadow-lg"
              >
                <div className="aspect-video overflow-hidden relative">
                  <div className="w-full h-full bg-white/10 animate-pulse absolute"></div>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover relative z-10"
                    onLoad={(e) => {
                      const loader = e.currentTarget.previousElementSibling as HTMLElement
                      if (loader) loader.remove()
                    }}
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 text-xs bg-white/20 text-gray-200 rounded-full backdrop-blur-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all text-sm font-medium shadow-lg w-full justify-center"
                  >
                    View Project
                    <i className="fas fa-external-link-alt" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}