# Go4It Sports Platform Admin Account Setup

This guide provides instructions for setting up administrator accounts on the Go4It Sports platform.

## Default Admin Account

The platform is pre-configured with a default admin account:

- **Username**: admin
- **Password**: MyTime$$

**Important**: Change this password immediately after first login for security purposes.

## Creating Additional Admin Accounts

### Option 1: Using the Admin Dashboard

1. Log in with the default admin account
2. Navigate to "User Management" in the admin dashboard
3. Click "Create New User"
4. Fill in the user details, ensuring to select "Administrator" as the role
5. Click "Create Account"
6. The new admin will receive an email with account details (if email is configured)

### Option 2: Using the Database Script

For initial setup or recovery purposes, you can create an admin account directly:

1. Navigate to the project directory on your server
2. Run the admin password reset script:

```bash
# This will create or reset the admin password
node reset-admin-password.ts
```

## Admin Account Roles and Permissions

Administrator accounts have full access to all platform features, including:

- User management
- Content management
- System configuration
- Analytics and reporting
- API key management
- Video analysis settings
- XP and reward system configuration

## Security Best Practices

- Use strong, unique passwords for all admin accounts
- Change the default admin password immediately
- Limit the number of administrator accounts
- Regularly audit admin account activity
- Remove admin access for users who no longer require it
- Consider implementing two-factor authentication for admin accounts

## Common Issues and Solutions

### Admin Password Reset

If an admin user forgets their password:

1. Another administrator can reset it through the User Management interface
2. Alternatively, run the admin reset script on the server:

```bash
node reset-admin-password.ts
```

### Account Lockout

If an admin account is locked due to too many failed login attempts:

1. Another admin can unlock the account from User Management
2. Alternatively, update the user's status directly in the database:

```sql
UPDATE users SET locked = false WHERE username = 'admin_username';
```

## Additional Notes

- The first user created in a new installation is automatically assigned admin rights
- Admin accounts can create and manage coach accounts
- Consider creating separate admin accounts for different team members rather than sharing credentials