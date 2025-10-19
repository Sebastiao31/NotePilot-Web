import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import React from 'react'

const LandingPage = () => {
  return (
    <div>
        <a href="/sign-in">
            <button>
                Sign In
            </button>
        </a>
    </div>
  )
}

export default LandingPage