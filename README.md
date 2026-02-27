# URMC Website

<p align="center"><img src="https://github.com/emarc0314/urmc-website/assets/75585259/e2364b44-1c8e-40ff-9441-2b2b267a06f0" width="40%"></img>
</p>

The purpose of the Underrepresented Minorities in Computing club (URMC), is to promote diversity in the tech space. [Our website](https://urmc.cs.cornell.edu) serves to contribute to URMC's outreach, and inform our community of who we are and what resources we offer at Cornell.

## Development

### Setup

1. Install [Node.js](https://nodejs.org/en/download) (npm is included)
2. Clone the repo and run `npm install`
3. Copy `.env.example` to `.env` and fill in the values — ask a team member for the actual credentials

### Running Locally

```bash
npm start           # production environment
npm run start:staging  # staging environment
```

### Deployment

Run `npm run build` to generate the `build` folder with all production assets.

For any questions or concerns on our website, reach out to urmc@cornell.edu
