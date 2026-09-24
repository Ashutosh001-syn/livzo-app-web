POST /api/auth/signup

Validate signup input, create a USER and password account in one Prisma transaction, issue a single-use email verification token, and return secure session cookies only according to the product's unverified-account policy.
