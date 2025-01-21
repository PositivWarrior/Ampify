### Amplify ###

    Amplify is a subscription-based music streaming platform that combines seamless user experience with a modern tech stack. Designed with a responsive and visually appealing UI, Amplify enables users to upload and listen to their favorite music, manage subscriptions, and enjoy a premium experience powered by Stripe and Supabase. 'Not at all' is it a Spotify-Clone ;)

### Features ###

- 🎵 Music streaming
- 👤 User authentication
- 📱 Responsive design
- 🎶 Playlist creation and management
- 🔍 Song search functionality
- ⭐ Liked songs collection
- 🎨 Custom audio player
- 💳 Premium subscription support (Stripe integration)

- 👤 User Authentication and Profile Management:

    Secure login and registration using Supabase Auth.

    Manage user profiles, including avatars and billing details.

- Subscription Management:

    Seamless integration with Stripe for managing subscriptions and payments.

    Real-time updates for subscription statuses using Stripe Webhooks.

    Support for multiple subscription plans.

- Product and Pricing Synchronization:

    Automatic synchronization of products and prices from Stripe.

    Display active plans with detailed pricing information.

- Music Upload and Playback:

    Users can upload their own songs.

    Simple and intuitive music playback interface.

- Modern UI/UX:

    Responsive design built with Tailwind CSS.

    Clean, professional layout with intuitive navigation.

### Tech Stack ###

* Frontend

    - Next.js 13
    - React.js
    - TypeScript
    - Tailwind CSS
    - Zustand (State Management)
    - React Hot Toast
    - React Icons

* Backend

    - Supabase (Backend as a Service)
    - PostgreSQL Database
    - Supabase Auth
    - Supabase Storage

* Other Tools

    - Stripe

### Getting Started ###

* Before running the project, make sure you have:

    - Node.js (v14.0 or higher)
    - npm or yarn
    - Supabase account
    - Stripe account (for payment processing)

* Setup Instructions

    Clone the repository:

    git clone https://github.com/positivwarrior/amplify.git
    cd amplify

* Install dependencies:

    npm install / yarn install

* Create a .env.local file in the root directory with the following variables:

    NEXT_PUBLIC_SUPABASE_URL =              your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY =         your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY =             your_supabase_service_role_key

    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =    your_stripe_publishable_key
    STRIPE_SECRET_KEY =                     your_stripe_secret_key
    STRIPE_WEBHOOK_SECRET =                 your_stripe_webhook_secret


* Start the development server:

    npm run dev

* Open your browser and visit:

    http://localhost:3000

### Project Structure ###

Amplify/
├── app/                        # Next.js app directory
├── actions/                    # All actions that app uses
├── components/                 # Reusable components
├── hooks/                      # Custom React hooks
├── libs/                       # Utility functions
├── providers/                  # Context providers
├── public/                     # Static assets
└── types/                      # TypeScript type definitions
├── .env.local                  # Environment variables
├── package.json                # Project dependencies and scripts
└── README.md                   # Documentation

### Key Components ### 

* Custom Hooks

    - useGetSongById - Fetches song details by ID
    - usePlayer - Manages audio player state
    - useLoadImage - Handles image loading from Supabase storage
    - useUser - Manages user authentication state

* Main Features

    - User authentication with Supabase
    - Music playback with custom audio player
    - Playlist management
    - Library organization
    - Search functionality
    - Responsive design for all devices

### API Routes ### 

    /api/create-checkout-session - Handles premium subscription checkout
    /api/create-portal-link - Manages subscription portal
    /api/webhooks - Handles Stripe webhooks

### Deployment ###

    The application can be deployed using Vercel:

        - Connect your GitHub repository to Vercel
        - Configure environment variables
        - Deploy

### Contributing ###

    - Fork the repository
    - Create a feature branch (git checkout -b feature/amazing-feature)
    - Commit your changes (git commit -m 'Add amazing feature')
    - Push to the branch (git push origin feature/amazing-feature)
    - Open a Pull Request

### Author ###  

    Kacper Margol

    GitHub: positivwarior

    Email: kacpermargol@gmail.com

### License ###

    This project is licensed under the MIT License. See the LICENSE file for details.

### Acknowledgments ###

    Next.js
    Supabase
    Stripe
    Tailwind CSS