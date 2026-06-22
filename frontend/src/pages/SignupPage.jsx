import { SignUp } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

function SignupPage() {
return (
<div className="min-h-screen flex" style={{ backgroundColor: '#fff5f9' }}>


<div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 py-12">

<div className="w-full max-w-md">


<div className="flex items-center gap-2 mb-10">
  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#ec4899' }}>
   <img src="DropHouse.png"/>
   </div>
  <span className="text-2xl font-bold">DropHouse</span>
</div>

   <h2 className="text-3xl font-bold mb-1" style={{ color: '#1a1a2e' }}>Create account</h2>
   <p className="mb-8" style={{ color: '#9ca3af' }}>Join DropHouse and never miss a drop</p>

<SignUp routing="hash" appearance={{elements: {rootBox: 'w-full',card: 'shadow-none p-0 bg-transparent',headerTitle: 'hidden',
  headerSubtitle: 'hidden',socialButtonsBlockButton: 'border border-pink-200 hover:bg-pink-50 transition-all rounded-xl py-3',
  dividerLine: 'bg-pink-100',dividerText: 'text-pink-300',formFieldInput: 'border border-pink-200 rounded-xl px-4 py-3 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 bg-white transition-all',
  formFieldLabel: 'text-gray-600 font-medium text-sm mb-1',
  formButtonPrimary: 'w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90',
  footerActionLink: 'text-pink-500 hover:text-pink-600 font-medium',},variables: {colorPrimary: '#ec4899',colorBackground: '#fff5f9',borderRadius: '12px',
fontFamily: 'Inter, sans-serif',}}}/>

<p className="text-center mt-6 text-sm" style={{ color: '#9ca3af' }}>
Already have an account?{' '}
<Link to="/login" className="font-semibold" style={{ color: '#ec4899' }}>
Sign in
</Link>
</p>

</div>
</div>


<div className="hidden lg:flex w-1/2 relative overflow-hidden">
<img src="/images/login-bg.png" alt="DropHouse Fashion"
className="w-full h-full object-cover"/>  <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, transparent, #fff5f9)' }} />
  <div className="absolute bottom-10 right-10 text-right">
  <h1 className="text-5xl font-bold text-white drop-shadow-lg">House.</h1>
  <p className="text-white/80 text-lg mt-2 drop-shadow">Your next favourite brand lives here.</p>
  </div>
  </div>

</div>
)
}

export default SignupPage