import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
}

interface AuthStore {
  user: UserProfile | null
  loading: boolean
  signIn: (email: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      
      signIn: async (email, name) => {
        set({ loading: true })
        // Simulate a short network latency
        await new Promise((r) => setTimeout(r, 600))
        set({
          user: {
            uid: 'mock-user-' + Math.random().toString(36).substring(2, 11),
            email,
            displayName: name,
            photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
          },
          loading: false
        })
      },
      
      signInWithGoogle: async () => {
        set({ loading: true })
        
        // Dimensions and positioning for a Google-style authorization popup
        const width = 500
        const height = 600
        const left = window.screenX + (window.innerWidth - width) / 2
        const top = window.screenY + (window.innerHeight - height) / 2
        
        const popup = window.open(
          '',
          'Google SignIn',
          `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
        )
        
        if (popup) {
          popup.document.write(`
            <html>
              <head>
                <title>Sign in with Google</title>
                <style>
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f7f9fa;
                  }
                  .container {
                    text-align: center;
                    background: white;
                    padding: 40px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    width: 320px;
                  }
                  .logo {
                    width: 48px;
                    height: 48px;
                    margin-bottom: 20px;
                  }
                  .title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #202124;
                    margin-bottom: 8px;
                  }
                  .subtitle {
                    font-size: 14px;
                    color: #5f6368;
                    margin-bottom: 24px;
                  }
                  .account-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    width: 100%;
                  }
                  .account-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 16px;
                    background: white;
                    border: 1px solid #dadce0;
                    border-radius: 24px;
                    cursor: pointer;
                    transition: background 0.2s, border-color 0.2s;
                    text-align: left;
                  }
                  .account-item:hover {
                    background: #f8fafd;
                    border-color: #c2e7ff;
                  }
                  .avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 14px;
                  }
                  .account-info {
                    display: flex;
                    flex-direction: column;
                  }
                  .account-name {
                    font-size: 14px;
                    font-weight: 500;
                    color: #3c4043;
                  }
                  .account-email {
                    font-size: 12px;
                    color: #5f6368;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <svg class="logo" viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.48c0,-0.61 -0.05,-1.2 -0.15,-1.78Z" fill="#4285F4" />
                    <path d="M12,20.6c2.59,0 4.77,-0.86 6.36,-2.33l-3.3,-2.57c-0.91,0.61 -2.08,0.98 -3.06,0.98c-2.48,0 -4.59,-1.67 -5.34,-3.93h-3.41v2.64c1.58,3.14 4.82,5.21 8.75,5.21Z" fill="#34A853" />
                    <path d="M6.66,12.78c-0.19,-0.57 -0.3,-1.18 -0.3,-1.78s0.11,-1.21 0.3,-1.78V6.58H3.25c-0.66,1.32 -1.03,2.8 -1.03,4.42s0.37,3.1 1.03,4.42l3.41,-2.64Z" fill="#FBBC05" />
                    <path d="M12,5.74c1.41,0 2.68,0.49 3.68,1.44l2.76,-2.76c-1.66,-1.55 -3.82,-2.5 -6.44,-2.5c-3.93,0 -7.17,2.07 -8.75,5.21l3.41,2.64c0.75,-2.26 2.86,-3.93 5.34,-3.93Z" fill="#EA4335" />
                  </svg>
                  <div class="title">Choose an account</div>
                  <div class="subtitle">to continue to May Bay Lo</div>
                  
                  <div class="account-list">
                    <div class="account-item" onclick="selectAccount('John Doe', 'john.doe@gmail.com', '#8ab4f8')">
                      <div class="avatar" style="background-color: #1a73e8">JD</div>
                      <div class="account-info">
                        <span class="account-name">John Doe</span>
                        <span class="account-email">john.doe@gmail.com</span>
                      </div>
                    </div>
                    <div class="account-item" onclick="selectAccount('Sarah Jenkins', 'sarah.j@gmail.com', '#f28b82')">
                      <div class="avatar" style="background-color: #e91e63">SJ</div>
                      <div class="account-info">
                        <span class="account-name">Sarah Jenkins</span>
                        <span class="account-email">sarah.j@gmail.com</span>
                      </div>
                    </div>
                  </div>
                </div>

                <script>
                  function selectAccount(name, email, color) {
                    window.opener.postMessage({ type: 'GOOGLE_SIGNIN_SUCCESS', name, email }, '*');
                    window.close();
                  }
                </script>
              </body>
            </html>
          `)
        }
        
        return new Promise<void>((resolve) => {
          const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'GOOGLE_SIGNIN_SUCCESS') {
              const { name, email } = event.data
              set({
                user: {
                  uid: 'google-user-' + Math.random().toString(36).substring(2, 11),
                  email,
                  displayName: name,
                  photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
                },
                loading: false
              })
              window.removeEventListener('message', handleMessage)
              resolve()
            }
          }
          window.addEventListener('message', handleMessage)
        })
      },
      
      signOut: async () => {
        set({ loading: true })
        await new Promise((r) => setTimeout(r, 400))
        set({ user: null, loading: false })
      }
    }),
    {
      name: 'may-bay-lo-auth'
    }
  )
)
