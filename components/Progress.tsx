"use client"

import { useEffect, useState } from "react"

interface ProgressProps {
  progressBarBG: string
  color: string
  stages: string[]
  currentStage: string
}

const Progress = ({ color, progressBarBG, stages, currentStage }: ProgressProps) => {
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    if (!stages.includes(currentStage) && currentStage) {
      console.error("Invalid stage:", currentStage)
      return
    }

    const progressBar = document.getElementById("progressBar")
    const bar = document.getElementById("bar")

    if (!progressBar || !bar) return

    const max_w = bar.offsetWidth
    const currentStageIndex = stages.indexOf(currentStage) + 1
    const percentage = (currentStageIndex * 100) / stages.length

    setPercentage(percentage)
    progressBar.style.width = `${(currentStageIndex * max_w) / stages.length}px`
  }, [currentStage, stages])

  return (
    <div
      className={`relative transition-all border border-gray-700 rounded-md w-full h-full overflow-hidden ${
        currentStage ? "scale-100" : "scale-0"
      }`}
      id="bar"
    >
      <div
        id="progressBar"
        className={`${progressBarBG} w-0 transition-all rounded-md absolute max-w-full h-full`}
      ></div>
      <div className={`${color} absolute z-10 w-full text-center h-full flex items-center justify-center text-sm`}>
        {currentStage}: {Math.floor(percentage)}%
      </div>
    </div>
  )
}

export default Progress
