# DNS Configuration Guide for go4itsports.org

This guide explains how to set up DNS properly for your Go4It Sports platform on the new server IP (188.245.209.124).

## Required DNS Records

Configure these DNS records with your domain registrar/DNS provider:

### Essential Records

| Type | Name | Value | TTL | Purpose |
|------|------|-------|-----|---------|
| A | @ | 188.245.209.124 | 300 | Points domain root to your server |
| A | www | 188.245.209.124 | 300 | Points www subdomain to your server |
| CNAME | * | go4itsports.org | 300 | Wildcard for subdomains (optional) |

### Email-Related Records (If Using Server-Based Email)

| Type | Name | Value | TTL | Purpose |
|------|------|-------|-----|---------|
| MX | @ | mail.go4itsports.org | 300 | Mail exchanger (priority 10) |
| A | mail | 188.245.209.124 | 300 | Points mail subdomain to your server |
| TXT | @ | v=spf1 ip4:188.245.209.124 ~all | 300 | SPF record for email authentication |
| TXT | _dmarc | v=DMARC1; p=none; rua=mailto:admin@go4itsports.org | 300 | DMARC policy |

### Security Records

| Type | Name | Value | TTL | Purpose |
|------|------|-------|-----|---------|
| CAA | @ | 0 issue "letsencrypt.org" | 300 | Certificate Authority Authorization |
| CAA | @ | 0 issuewild ";" | 300 | Prevents unauthorized wildcard certs |

## DNS Propagation

After updating your DNS records:

1. **TTL (Time-to-Live)** determines how long DNS records are cached. Setting a low TTL (300 seconds = 5 minutes) during migration helps faster propagation.

2. **Check Propagation**: Use these tools to verify your DNS changes:
   - https://www.whatsmydns.net
   - https://dnschecker.org
   - https://dns.google

3. **Global Propagation** can take up to 24-48 hours, but most users will see updates within minutes to a few hours with the TTL settings above.

## Testing DNS Configuration

Before the final cutover, you can test without changing your main DNS by:

1. Modifying your local hosts file:
   - Windows: C:\Windows\System32\drivers\etc\hosts
   - Mac/Linux: /etc/hosts
   
   Add this line:
   ```
   188.245.209.124 go4itsports.org www.go4itsports.org
   ```

2. Flush your DNS cache after modifying:
   - Windows: `ipconfig /flushdns`
   - Mac: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
   - Linux: `sudo systemd-resolve --flush-caches`

## DNS Migration Strategy

To minimize downtime during DNS transition:

1. **Prepare new server completely** before DNS change
2. **Lower TTL values** on all records to 300 seconds at least 24 hours before migration
3. **Make DNS changes** during a low-traffic period
4. **Monitor both old and new servers** during transition
5. **Increase TTL values** back to normal (3600 or higher) after successful migration

## Email Migration Considerations

If transitioning email services:

1. Set up mail services on the new server before DNS changes
2. Consider temporarily lowering MX record priority during transition
3. Ensure all email-related DNS records (SPF, DKIM, DMARC) are properly configured
4. Test mail delivery and spam score before full migration