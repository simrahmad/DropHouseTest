import { useState, useEffect } from 'react'

// shows a countdown to releaseDate if upcoming, or to endDate if live
export default function Countdown({ releaseDate, endDate, status }) {
const [timeLeft, setTimeLeft] = useState('')

function calc() {
const now = new Date()
const target = status === 'UPCOMING' ? new Date(releaseDate) : new Date(endDate)
const diff = target - now

if (diff <= 0) {
setTimeLeft(status === 'UPCOMING' ? 'Live now!' : 'Ended')
return
}

const d = Math.floor(diff / (1000 * 60 * 60 * 24))
const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
const s = Math.floor((diff % (1000 * 60)) / 1000)

if (d > 0) setTimeLeft(`${d}d ${h}h ${m}m`)
else if (h > 0) setTimeLeft(`${h}h ${m}m ${s}s`)
else setTimeLeft(`${m}m ${s}s`)
}

useEffect(() => {
calc()
const interval = setInterval(calc, 1000)
return () => clearInterval(interval)
}, [status, releaseDate, endDate])

if (status === 'ENDED') return null

const label = status === 'UPCOMING' ? 'Drops in' : 'Ends in'
const color = status === 'LIVE' ? '#10b981' : '#ec4899'

return (
<div style={{
display: 'flex',
alignItems: 'center',
gap: 6,
fontSize: 13,
color,
fontWeight: 600,
marginTop: 6
}}>
<span style={{
width: 8, height: 8, borderRadius: '50%',
background: color,
display: 'inline-block',
animation: 'pulse 1.5s ease-in-out infinite'
}} />
{label}: {timeLeft}
<style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
</div>
)
}