import { useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import axios from 'axios'

function useSyncUser() {
const { user, isSignedIn, isLoaded } = useUser()

useEffect(() => { if (!isLoaded || !isSignedIn || !user) return
const sync = async () => {
try { await axios.post(`${import.meta.env.VITE_API_URL}/api/users/sync`, {
clerkId: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
   email: user.primaryEmailAddress?.emailAddress,
   profileImage: user.imageUrl})} 
   catch (err) {console.error('User sync failed', err)}}
sync()}, [isLoaded, isSignedIn, user])}

export default useSyncUser

