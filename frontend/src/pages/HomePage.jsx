import Navbar from '../components/Navbar'
import { useUser } from '@clerk/clerk-react'
import { useState, useEffect } from 'react'
import axios from 'axios'


function DropCard({ drop }) {

    


return (
<div className="group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
style={{ backgroundColor: '#fff', boxShadow: '0 2px 16px rgba(236,72,153,0.07)', border: '1px solid #fce7f3' }}>

<div className="relative flex items-center justify-center" style={{ height: '220px', backgroundColor: drop.color }}>
    <img src={drop.coverImage} alt={drop.title}
onError={e => e.target.src = '/images/drop1.jpg'}/>
<div className="absolute top-4 left-4">
<span className="px-3 py-1 rounded-full text-xs font-semibold"
style={{
backgroundColor: drop.tag === 'Live Now' ? '#ec4899' : '#fff',
color: drop.tag === 'Live Now' ? '#fff' : '#ec4899',
border: drop.tag === 'Live Now' ? 'none' : '1px solid #fce7f3'
}}>
{drop.tag === 'Live Now' ? '● Live Now' : '◷ ' + drop.tag}
</span>
</div>
      </div>

      </div>
)
}

function HomePage() {
const { user } = useUser()
const [drops, setDrops] = useState([])

useEffect(() => {

axios.get(`${import.meta.env.VITE_API_URL}/api/drops`)

.then(res => setDrops(res.data))
.catch(console.error)
}, [])

return (
<div style={{ backgroundColor: '#fff5f9', minHeight: '100vh' }}>
<Navbar />


<div className="relative w-full overflow-hidden flex items-center justify-center" style={{ minHeight: '580px', backgroundColor: 'white' }}>


<div className="absolute rounded-full" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)', top: '-100px', right: '-100px' }} />
<div className="absolute rounded-full" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', bottom: '-80px', left: '-80px' }} />


<div className="absolute hidden lg:flex flex-col gap-3" style={{ left: '6%', top: '50%', transform: 'translateY(-50%)' }}>
 <div className="bg-white rounded-2xl px-5 py-3 text-center shadow-sm">
    <h1 className="p-5"> Shop out Now</h1>
    <div className="p-y-3"/>
<p className=" text-pink-400 font-bold text-center">Shoes  </p>
<img src="Shoes.png" className=" w-20 h-20"/>
</div>


 <div className="bg-white rounded-2xl px-5 py-3 text-center shadow-sm">
<p className=" text-pink-400 font-bold text-center">Dress </p>
<img src="Dress.webp" className=" w-20 h-20"/>
</div>

 <div className="bg-white rounded-2xl px-5 py-3 text-center shadow-sm">
<p className=" text-pink-400 font-bold text-center">Rings  </p>
<img src="Ring.jpg" className=" w-20 h-20"/>
</div>


</div>


<div className="absolute hidden lg:flex flex-col gap-3" style={{ right: '6%', top: '50%', transform: 'translateY(-50%)' }}>
    <div className="bg-white rounded-2xl px-5 py-3 text-center shadow-sm">
<p className=" text-pink-400 font-bold text-center"> 2h 14m Left</p>
<p className="text-gray-400 font-light">Drop Ends in</p>
</div>

<div className="bg-white rounded-2xl px-5 py-3 text-center shadow-sm" style={{ border: '1px solid #fce7f3', minWidth: '130px' }}>
<p className=" text-pink-400 font-bold text-center">42</p>
<p className="text-gray-400 font-light">Pieces Left</p>
</div>

<div className="bg-white rounded-2xl px-5 py-3 text-center shadow-sm" style={{ border: '1px solid #fce7f3', minWidth: '130px' }}>
<p className=" text-pink-400 font-bold text-center"> 1.7K</p>
<p className="text-gray-400 font-light">CUSTOMER Reviews</p>
</div>
</div>

<div className="text-center px-6 relative z-10">
    <img src="FullPage.png" className="w-200 h-100 rounded-3xl shadow-lg" />
    <div className="p-6"></div><br/>
  <div className="inline-block  px-5 py-2 rounded-full text-sm font-semibold mb-4">New Drop Available Now</div><br/>
  

<h1 className="font-bold mb-4 leading-tight text-black text-4xl">The Summer Capsule<br/> <span className="text-pink-400"> 2026</span></h1><br/>

<p className="text-gray-400 font-extralight">Limited pieces. Unlimited expression. Shop before it's gone.<br/><br/></p>

<div className="flex gap-4 justify-center flex-wrap">
    <div className="p-4 bg-pink-400">
<button className="px-8 py-4 rounded text-white font-semibold text-base transition-all hover:scale-105 active:scale-95 bg-pink-400 hover:bg-pink-700">Shop the Drop
</button></div>
<div className="p-4 bg-pink-400">
<button className="px-8 py-4 text-white rounded font-semibold text-base transition-all hover:bg-pink-700 bg-pink-400">View All Drops</button></div>
</div>
</div>
</div>
<br/>

<div className="w-full py-5 gap-60" style={{ backgroundColor: '#fff', borderBottom: '1px solid #fce7f3', borderTop: '1px solid #fce7f3' }}>
<div className="max-w-5xl mx-auto flex justify-center justify-around flex-wrap gap-50 px-6">
    <div className=""><p><img src="Shopping.jpg" className="w-10 h-10 "/>Sales</p></div>
 <p><img src="View.png" className="w-10 h-10 "/>20K Website views</p> 
 <p><img src="mission-model.png" className="w-10 h-10 "/>Fashion Sense</p>
 <p><img src="Liking.jpg" className="w-10 h-10 "/>15K+ Liking</p>

</div>
</div>
<br/>
<br/>


<div className="max-w-6xl mx-auto px-6 py-14">
<br/>
<div className="">
<div>
<p className="text-sm font-semibold uppercase tracking-widest mb-1 text-pink-400 text-center">This Week</p>
<h2 className="text-3xl font-bold text-pink-400 text-center">Welcome back, {user?.firstName} 👋</h2>
<p className=" text-gray-400 font-extralight text-center">Here's what's dropping this week.</p><br/><br/>
</div>
<button className="hidden md:flex items-center gap-1 text-sm font-semibold transition-all hover:gap-2"
style={{ color: '#ec4899' }}>View all drops →</button>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{drops.map(drop => <DropCard key={drop.id} drop={drop} />)}
</div>
</div>

<div className="max-w-6xl mx-auto px-6 pb-10">
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
{[
{ icon: '⚡', title: 'Limited Drops', desc: 'Every piece is exclusive. Once it\'s gone, it\'s gone forever.' },
{ icon: '🚚', title: 'Fast Shipping', desc: 'Orders dispatched within 24h. Track every step of the way.' },
{ icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free returns on all orders, no questions asked.' },
].map(f => (
<div key={f.title} className="p-6 rounded-2xl flex gap-4 items-start"
style={{ backgroundColor: '#fff', border: '1px solid #fce7f3' }}>
<span className="text-3xl">{f.icon}</span>
<div>
<h4 className="font-semibold mb-1" style={{ color: '#1a1a2e' }}>{f.title}</h4>
<p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{f.desc}</p>
</div>
</div>
))}
</div>
</div>
<br/>
<div className="bg-pink-150">
    <div className="grid grid-cols-2 gap-2">
        <div className="">
    <h1 className="text-5xl text-pink-400"> Never Miss a Drop</h1><br/>
    <p>Get notified with the moments new Drop go Live</p><br/>
    <div className="flex justify-center">
    <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-sm">
        <input type="email"placeholder="your@email.com" className="w-full px-4 py-2.5 text-gray-900" required/>
        <button type="submit"className="px-4 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm transition-all whitespace-nowrap">Join</button></form></div>
        <br/>

         <br/>
         <div className="m-10 text-centre">
        <p className="m-20 p-40">Absolutely love the quality! The fabric feels premium, the fit is perfect, and the delivery was faster than expected. DropHouse has become my favorite fashion store."<br/><span className="text-pink-400">Ratings: ⭐⭐⭐⭐⭐ <img src="review1.jpg" className="w-10 h-10 flex justify-right rounded"/></span></p><br/>
        <p>"The designs are trendy and unique. I ordered a hoodie and it looked even better in person. Highly recommended!"<br/><span className="text-pink-400">Ratings: ⭐⭐⭐⭐⭐ <img src="review2.jpg" className="w-10 h-10 flex justify-right rounded"/></span></p><br/>
        <p>"I've ordered multiple times from DropHouse and have never been disappointed. Stylish clothing, excellent quality, and amazing CUSTOMER service.""<br/><span className="text-pink-400">Ratings: ⭐⭐⭐⭐⭐ <img src="review3.jpg" className="w-10 h-10 flex justify-right rounded"/></span></p><br/>
        <p>"Affordable prices without compromising quality. It's rare to find fashion pieces this good at these prices."<br/><span className="text-pink-400">Ratings: ⭐⭐⭐⭐⭐ <img src="review4.jpg" className="w-10 h-10 flex justify-right rounded"/></span></p><br/>
        </div>
        </div>
        <div className="flex justify-end" >
        <img src="Reviews.jpg" className="hidden lg:flex w-full h-full relative overflow-hidden"/></div></div></div>
</div>
)
}

export default HomePage