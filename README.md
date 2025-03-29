## Curators Backend

Curators Backend automates the process of identifying high-performing Liquid Staking Tokens (LSTs) on Solana and facilitates automatic swapping to optimize yield.

### Features
- Track and analyze performance metrics of Solana LSTs using Sanctum
- Identify top-performing LST Tokens based on APY and other metrics
- Automated Swapping Mechanism to move funds to the best-performing LST. Implemented Jito and Jupiter for Swapping. Fastest Transaction Possible.
- Secure Transaction Handling
- Historical Performance Tracking and Reporting
- Custom Platform Fees Instruction

### Tech-Stack
- Fastify Backend + TypeScript
- PostgreSQL Database
- Solana / Jupiter / Jito / Sanctum
- Prisma
- Docker

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for authentication tokens
- `SOLANA_RPC_URL`: Solana RPC endpoint
- `SANCTUM_API_KEY`: API key for Sanctum integration
- `JUPITER_API_KEY`: API key for Jupiter swaps (if required)
- `PLATFORM_FEE_ADDRESS`: Address to receive platform fees