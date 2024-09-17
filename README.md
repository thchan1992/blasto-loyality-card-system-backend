# Blasto - Digital Gift Card System (SaaS)

<img src="./landing-page-screenshot.png" alt="Blasto Banner" width="800"/>

## Live Demo

Check out the [live demo of Blasto](https://blasto-red.vercel.app) to see the system in action!

## Description

Blasto is a lightweight gift card system designed to help businesses collect stamps from their customers. This repository contains both the front-end and back-end components of the SaaS platform. Customers can later use the [Blasta](https://github.com/thchan1992/blasta) to redeem their rewards.

## Key Features

- Issue stamps to customers by scanning their Blasta app
- Distribute rewards to customers by scanning the Blasta app
- Track the number of stamps given away
- Monitor remaining rewards available for redemption
- Modify business details
- Purchase additional stamps using Stripe integration

## Technologies Used

- Next.js (Frontend and API Routes)
- MongoDB
- Mongoose
- Clerk Authentication
- Stripe Payment Integration
- DaisyUI
- Vercel (Deployment)
- Zod (Schema Validation)
- AWS S3 (File Storage)
- Postmark (Email Service)

## Installation

To set up the project locally, follow these steps:

1. Clone the repository

   ```
   git clone https://github.com/your-username/blasto.git
   cd blasto
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Set up environment variables (create a `.env.local` file in the root directory)

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   WEBHOOK_SECRE=your_key
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_AWS_S3_REGION=your_key
   NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID=your_key
   NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY=your_key
   NEXT_PUBLIC_AWS_S3_BUCKET_NAME=your_bucket_name
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_key
   STRIPE_PRICE_ID=your_stripe_price_id
   POSTMARK_API_TOKEN=your_postmark_key
   SUPPORT_EMAIL=your_support_email_address
   ```

4. Run the development server

   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This project is deployed on Vercel. To deploy your own instance:

1. Push your code to your own GitHub repository
2. Connect your Vercel account to your GitHub repository
3. Configure the environment variables in Vercel
4. Deploy the project

## License

This project is licensed under the MIT License - see the LICENSE file for details.
MIT License is a permissive license that allows for reuse within proprietary software provided all copies of the licensed software include a copy of the MIT License terms and the copyright notice.

## Contact

For any inquiries or support, please contact Han at info@windyrecipe.com.
