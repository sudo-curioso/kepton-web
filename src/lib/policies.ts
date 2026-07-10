export type PolicyBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string; level?: 2 | 3 }
  | { type: 'list'; items: string[] }
  | { type: 'notice'; text: string }

export type PolicyDocument = {
  slug: string
  title: string
  subtitle?: string
  effectiveDate: string
  lastUpdated?: string
  meta?: string
  blocks: PolicyBlock[]
}

export const POLICY_LINKS = [
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/subscription-policy', label: 'Subscription & Refund Policy' },
  { href: '/health-disclaimer', label: 'Health & Wellness Disclaimer' },
] as const

export const policies: Record<string, PolicyDocument> = {
  terms: {
    slug: 'terms',
    title: 'Kepton — Terms & Conditions',
    subtitle:
      'Terms of Service governing use of the Kepton mobile application and the kepton.app website',
    effectiveDate: '[PLACEHOLDER: insert publish date]',
    lastUpdated: '[PLACEHOLDER: insert date]',
    meta: 'Applies to users in the European Union, United Kingdom, United States, and Asia-Pacific',
    blocks: [
      {
        type: 'paragraph',
        text: 'These Terms & Conditions ("Terms") are a binding agreement between you ("you" or "User") and the operator of Kepton ("Kepton," "we," "us," or "our"), governing your access to and use of the Kepton mobile application and the kepton.app website (together, the "Service"). By creating an account, downloading the app, or otherwise using the Service, you agree to these Terms. If you do not agree, do not use the Service.',
      },
      { type: 'heading', text: '1. Who You Are Contracting With' },
      {
        type: 'paragraph',
        text: 'Kepton is currently operated by an individual trading under the name "2 Bros," based in Pune, Maharashtra, India.',
      },
      {
        type: 'notice',
        text: 'ACTION NEEDED BEFORE PUBLISHING: This clause assumes an unregistered individual operator. If you incorporate 2 Bros as a company or LLP later, this clause, the Privacy Policy controller section, and your App Store / Play Store developer account listing must all be updated together, and users should be notified of the change of contracting party.',
      },
      {
        type: 'paragraph',
        text: 'Contact for all notices under these Terms: keptonapp@gmail.com.',
      },
      { type: 'heading', text: '2. Eligibility and Age Requirement' },
      {
        type: 'paragraph',
        text: 'You must be at least 16 years old to create a Kepton account. By registering, you confirm that you meet this age requirement. Kepton does not knowingly permit registration by anyone under 16, and any account discovered to belong to a user under 16 will be suspended and the associated data deleted.',
      },
      {
        type: 'notice',
        text: "ACTION NEEDED BEFORE PUBLISHING: 16 was chosen as a single global age gate because it satisfies the strictest commonly applied EU member state threshold for a child's own consent to data processing (Article 8 GDPR sets this between 13 and 16 depending on the country). Confirm this matches your intended market before publishing; a lower gate (13) would need per-country consent-verification logic, which is materially more complex to build correctly.",
      },
      { type: 'heading', text: '3. The Service' },
      {
        type: 'paragraph',
        text: 'Kepton is a productivity and focus application designed to help users, including those who experience attention and focus difficulties, structure daily tasks using a timer-based session system, a visual "forest" progress mechanic, and a planning tool. Kepton is a general wellness and productivity tool.',
      },
      {
        type: 'paragraph',
        text: 'Kepton is not a medical device, is not intended to diagnose, treat, cure, or prevent any condition, and is not a substitute for professional medical, psychological, or psychiatric advice. See the separate Health & Wellness Disclaimer, which is incorporated into these Terms by reference.',
      },
      { type: 'heading', text: '4. Accounts' },
      {
        type: 'list',
        items: [
          'You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account.',
          'You must provide accurate information when registering and keep it up to date.',
          'You may not share, sell, or transfer your account to another person.',
          'We may suspend or terminate accounts that violate these Terms, without prior notice where required to protect the Service or other users.',
        ],
      },
      { type: 'heading', text: '5. Subscriptions and Payment' },
      {
        type: 'paragraph',
        text: 'Kepton offers a free tier and a paid "Pro" subscription tier, billed monthly or annually. Full billing, trial, renewal, cancellation, and refund terms are set out in the separate Subscription, Cancellation & Refund Policy, which is incorporated into these Terms by reference. Subscriptions are currently processed exclusively through the Apple App Store and Google Play Store billing systems; Kepton does not directly process or store your payment card details.',
      },
      { type: 'heading', text: '6. Acceptable Use' },
      { type: 'paragraph', text: 'You agree not to:' },
      {
        type: 'list',
        items: [
          'Use the Service for any unlawful purpose or in violation of any applicable law or regulation.',
          "Attempt to gain unauthorized access to the Service, other accounts, or Kepton's systems and infrastructure.",
          'Reverse engineer, decompile, or disassemble the app, except where such restriction is prohibited by applicable law.',
          'Scrape, harvest, or collect data from the Service through automated means without our prior written consent.',
          'Interfere with or disrupt the integrity or performance of the Service.',
          'Submit false, misleading, abusive, or harmful content through any input field, including the planning and task-entry features.',
          'Use the Service to harass, harm, or attempt to harm yourself or others; if you are in crisis, please contact your local emergency services or a crisis helpline rather than relying on Kepton.',
        ],
      },
      {
        type: 'paragraph',
        text: 'We may suspend or terminate access for any violation of this section.',
      },
      { type: 'heading', text: '7. In-App Planning Feature' },
      {
        type: 'paragraph',
        text: "Kepton's planning feature currently generates day plans from a fixed set of internal templates based on the energy level and preferences you provide. It does not call any third-party artificial intelligence service at this time. Text you submit into planning fields is filtered by an input-safety check before any future processing. If and when Kepton begins using a third-party AI model to generate personalized content, this section and the Privacy Policy will be updated in advance, and, where required by law, your consent will be obtained.",
      },
      { type: 'heading', text: '8. Intellectual Property' },
      {
        type: 'paragraph',
        text: 'The Service, including its software, design, visual assets (including the forest and tree artwork), trademarks, and the Kepton name and logo, are owned by Kepton or its licensors and protected by intellectual property laws. You are granted a limited, non-exclusive, non-transferable, revocable license to use the Service for your personal, non-commercial use, subject to these Terms.',
      },
      {
        type: 'paragraph',
        text: 'You retain ownership of the content you input into the Service, such as task names and planning notes ("User Content"). You grant Kepton a limited license to store, process, and display your User Content solely to operate and improve the Service for you.',
      },
      { type: 'heading', text: '9. Health & Wellness Disclaimer' },
      {
        type: 'paragraph',
        text: 'Kepton is a general productivity and wellness tool. It is not designed, validated, or marketed as a medical device or clinical treatment for ADHD or any other condition. Nothing in the Service constitutes medical advice, diagnosis, or treatment. Always seek the advice of a qualified physician, psychologist, or other licensed healthcare provider with any questions regarding a medical condition, including ADHD. Never disregard professional medical advice or delay seeking it because of something you have read or experienced in the Service. The full Health & Wellness Disclaimer, provided as a separate document, is incorporated into these Terms by reference and controls in the event of any conflict on this subject.',
      },
      { type: 'heading', text: '10. Disclaimers' },
      {
        type: 'paragraph',
        text: 'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND UNINTERRUPTED OR ERROR-FREE OPERATION. WE DO NOT WARRANT THAT THE SERVICE WILL MEET YOUR REQUIREMENTS OR PRODUCE ANY PARTICULAR OUTCOME IN YOUR PRODUCTIVITY, FOCUS, OR WELLBEING.',
      },
      {
        type: 'notice',
        text: 'ACTION NEEDED BEFORE PUBLISHING: EU and UK consumer law does not permit a business to fully disclaim statutory consumer guarantees (for example, the UK Consumer Rights Act 2015 implied term that digital content be of satisfactory quality). This clause should be read subject to a savings clause (see Section 14) preserving those mandatory rights; do not remove that savings clause.',
      },
      { type: 'heading', text: '11. Limitation of Liability' },
      {
        type: 'paragraph',
        text: 'To the maximum extent permitted by applicable law, Kepton and its operator shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, goodwill, or other intangible losses, arising from your use of or inability to use the Service. Our total aggregate liability for any claim arising out of or relating to these Terms or the Service shall not exceed the greater of (a) the amount you paid to us in the twelve months preceding the claim, or (b) INR 5,000.',
      },
      {
        type: 'notice',
        text: 'ACTION NEEDED BEFORE PUBLISHING: Confirm this liability cap figure and currency with local counsel for each market. The EU, UK, and several US states restrict how far liability can be limited for gross negligence, wilful misconduct, personal injury, or fraud; carve those out explicitly rather than relying on a blanket cap.',
      },
      { type: 'heading', text: '12. Indemnification' },
      {
        type: 'paragraph',
        text: 'You agree to indemnify and hold harmless Kepton and its operator from any claims, damages, liabilities, and expenses (including reasonable legal fees) arising from your violation of these Terms, your misuse of the Service, or your violation of any third-party right.',
      },
      { type: 'heading', text: '13. Termination' },
      {
        type: 'paragraph',
        text: 'You may stop using the Service and delete your account at any time from within the app or by emailing keptonapp@gmail.com. We may suspend or terminate your access to the Service if you breach these Terms, if required by law, or if we discontinue the Service. Sections that by their nature should survive termination (including Sections 8 through 12 and 14) will survive.',
      },
      { type: 'heading', text: '14. Governing Law and Dispute Resolution' },
      {
        type: 'paragraph',
        text: 'These Terms are governed by the laws of India, without regard to conflict-of-law principles, and the courts of Pune, Maharashtra shall have exclusive jurisdiction, subject to the paragraph below.',
      },
      {
        type: 'paragraph',
        text: 'Notwithstanding the above, if you are a consumer habitually resident in the European Union, the United Kingdom, or the United States, nothing in this Section removes the consumer protections you are entitled to under the mandatory laws of your country of residence, including your right to bring proceedings in your local courts and to rely on local consumer-protection statutes (for example, the EU Consumer Rights Directive, the UK Consumer Rights Act 2015, or applicable US state consumer-protection law). Where these Terms conflict with such mandatory local law, the mandatory local law prevails for that user only.',
      },
      {
        type: 'notice',
        text: 'ACTION NEEDED BEFORE PUBLISHING: This dual-track structure (India governing law plus a consumer carve-out) is the standard workable approach for a small operator selling globally without local entities in every market. It is not a substitute for a lawyer confirming enforceability in your highest-volume markets once you have real revenue there.',
      },
      { type: 'heading', text: '15. Changes to These Terms' },
      {
        type: 'paragraph',
        text: 'We may update these Terms from time to time. If we make material changes, we will notify you through the app or by email at least 14 days before the changes take effect. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms.',
      },
      { type: 'heading', text: '16. General Provisions' },
      {
        type: 'list',
        items: [
          'Severability: if any provision of these Terms is found unenforceable, the remaining provisions remain in full effect.',
          'No waiver: our failure to enforce a provision is not a waiver of our right to do so later.',
          'Assignment: you may not assign these Terms; we may assign them in connection with a merger, acquisition, or sale of assets, with notice to you.',
          'Entire agreement: these Terms, together with the Privacy Policy, Subscription Policy, and Health & Wellness Disclaimer, form the entire agreement between you and Kepton regarding the Service.',
          'Force majeure: we are not liable for delays or failures caused by events beyond our reasonable control.',
        ],
      },
      { type: 'heading', text: '17. Contact' },
      {
        type: 'paragraph',
        text: 'Questions about these Terms can be sent to keptonapp@gmail.com.',
      },
    ],
  },

  privacy: {
    slug: 'privacy',
    title: 'Kepton — Privacy Policy',
    subtitle:
      'How Kepton collects, uses, and protects your information (GDPR / UK GDPR, CCPA/CPRA, India DPDP Act, and APAC-aware)',
    effectiveDate: '[PLACEHOLDER: insert publish date]',
    lastUpdated: '[PLACEHOLDER: insert date]',
    blocks: [
      {
        type: 'paragraph',
        text: 'This Privacy Policy explains how Kepton ("we," "us," "our") collects, uses, discloses, and protects information when you use the Kepton mobile application and the kepton.app website (together, the "Service"). It applies to users worldwide, with specific sections for the European Union / United Kingdom, the United States, India, and other Asia-Pacific jurisdictions.',
      },
      { type: 'heading', text: '1. Who Is Responsible for Your Data' },
      {
        type: 'paragraph',
        text: 'Kepton is currently operated by an individual trading as "2 Bros," based in Pune, Maharashtra, India, who acts as the data controller (or "data fiduciary" under India\'s Digital Personal Data Protection Act, 2023) for the personal data described in this Policy.',
      },
      {
        type: 'notice',
        text: 'ACTION NEEDED BEFORE PUBLISHING: Update this controller identity, and re-issue this Policy, if and when the operating entity is incorporated.',
      },
      { type: 'paragraph', text: 'Privacy contact: keptonapp@gmail.com' },
      {
        type: 'notice',
        text: "ACTION NEEDED BEFORE PUBLISHING: India's DPDP Act requires a visible Grievance Officer contact once you have meaningful user volume. For now, keptonapp@gmail.com can serve this role, but note it here explicitly and update it if you appoint a dedicated Grievance Officer.",
      },
      { type: 'heading', text: '2. What Information We Collect' },
      { type: 'heading', text: '2.1 Account information', level: 3 },
      {
        type: 'list',
        items: [
          'Email address, used for authentication and account recovery.',
          'Trial and subscription status (trial end date, subscription tier).',
        ],
      },
      { type: 'heading', text: '2.2 Usage and productivity data', level: 3 },
      {
        type: 'list',
        items: [
          'Tasks you create, including title, priority, and chosen timer duration.',
          'Completed focus sessions and the resulting in-app "trees" and streaks.',
          'Responses to onboarding and in-app preference questions about your energy levels and working style, used only to select a planning template.',
        ],
      },
      {
        type: 'notice',
        text: 'ACTION NEEDED BEFORE PUBLISHING: Confirm the exact wording of your onboarding questions. They must ask about general working preferences, energy, and focus style, not about an ADHD diagnosis or symptom severity. If any question asks a user to self-report a diagnosis or medical symptom, that answer becomes "special category" health data under GDPR Article 9 and "sensitive personal data" under India\'s DPDP framework, which requires explicit, separate consent and additional safeguards. This Policy is drafted on the assumption that the current survey does not do this.',
      },
      { type: 'heading', text: '2.3 Device and technical data', level: 3 },
      {
        type: 'list',
        items: [
          'Device type, operating system version, and app version, collected automatically for compatibility and support.',
          'Crash and error diagnostic data, collected through Sentry.',
        ],
      },
      { type: 'heading', text: '2.4 Payment data', level: 3 },
      {
        type: 'paragraph',
        text: 'Subscription payments are processed entirely by the Apple App Store or Google Play Store. Kepton does not receive or store your full card number or billing address; we receive only confirmation of subscription status from Apple/Google.',
      },
      { type: 'heading', text: '3. Legal Bases for Processing (EU / UK Users)' },
      {
        type: 'list',
        items: [
          'Performance of a contract: to create your account, run the timer and forest features, and manage your subscription.',
          'Legitimate interests: to maintain security, prevent abuse, and improve the Service, balanced against your rights.',
          'Consent: for any analytics or marketing communications where consent is legally required, and for cookies as described in Section 6.',
        ],
      },
      { type: 'heading', text: '4. How We Use Your Information' },
      {
        type: 'list',
        items: [
          'To provide, operate, and maintain the Service.',
          'To process your subscription and communicate about billing.',
          'To respond to support requests.',
          'To diagnose and fix crashes and bugs.',
          'To comply with legal obligations.',
        ],
      },
      {
        type: 'paragraph',
        text: 'We do not sell your personal information, and we do not use your task or planning content to train third-party AI models.',
      },
      { type: 'heading', text: '5. Cookies and Similar Technologies' },
      {
        type: 'paragraph',
        text: 'The kepton.app website uses cookies and similar technologies. The mobile app uses equivalent on-device identifiers and SDK-level analytics rather than browser cookies.',
      },
      {
        type: 'list',
        items: [
          'Strictly necessary: required for login sessions and security; cannot be disabled.',
          'Functional: remember your preferences, such as display settings.',
          'Analytics: help us understand aggregate usage patterns.',
        ],
      },
      {
        type: 'notice',
        text: 'ACTION NEEDED BEFORE PUBLISHING: You have not listed a specific web analytics tool. If kepton.app uses any analytics or advertising script (Google Analytics, Meta Pixel, etc.), name it here and add a cookie-consent banner with granular accept/reject controls for EU/UK visitors before launch. Without a named tool, this section currently assumes strictly necessary cookies only.',
      },
      {
        type: 'paragraph',
        text: 'Where required by EU/UK law (ePrivacy Directive and GDPR), we obtain your consent before setting non-essential cookies, through a consent banner on first visit. You can withdraw consent at any time through your browser settings or the cookie preference link in the website footer.',
      },
      { type: 'heading', text: '6. Third Parties We Share Data With (Subprocessors)' },
      {
        type: 'list',
        items: [
          'Supabase — database hosting and user authentication.',
          'Vercel — hosting for the website and backend API routes.',
          'Sentry — crash and error diagnostic reporting.',
          'Apple Inc. and Google LLC — app distribution and subscription billing.',
          'RevenueCat — subscription status tracking and analytics, where enabled.',
        ],
      },
      {
        type: 'notice',
        text: 'ACTION NEEDED BEFORE PUBLISHING: Confirm the exact hosting region for your Supabase project (the schema notes suggest this has not been finalized). If any subprocessor stores data outside the EU/UK for EU/UK users, you need a valid international transfer mechanism, most commonly the EU Standard Contractual Clauses, referenced here once the region is confirmed.',
      },
      { type: 'heading', text: '7. International Data Transfers' },
      {
        type: 'paragraph',
        text: 'Where your data is transferred to a country outside your own, including to India where Kepton is operated, we rely on appropriate safeguards required by applicable law, such as Standard Contractual Clauses for EU/UK users, or your explicit consent where applicable.',
      },
      { type: 'heading', text: '8. Data Retention' },
      {
        type: 'paragraph',
        text: 'We retain your account and usage data for as long as your account is active. If you delete your account, we delete or anonymize your personal data within 30 days, except where we are required to retain limited records for legal, tax, or fraud-prevention purposes.',
      },
      {
        type: 'notice',
        text: 'ACTION NEEDED BEFORE PUBLISHING: Confirm this 30-day figure matches what Sahil can actually implement in Supabase (a deletion job or manual process). Do not publish a retention commitment the system cannot currently fulfil.',
      },
      { type: 'heading', text: '9. Your Rights' },
      { type: 'heading', text: '9.1 European Union and United Kingdom (GDPR / UK GDPR)', level: 3 },
      {
        type: 'paragraph',
        text: 'You have the right to access, correct, delete, restrict, or port your data, to object to certain processing, and to withdraw consent at any time. You also have the right to lodge a complaint with your local data protection authority.',
      },
      {
        type: 'heading',
        text: '9.2 United States (California CCPA/CPRA and similar state laws)',
        level: 3,
      },
      {
        type: 'paragraph',
        text: 'California residents have the right to know what personal information is collected, to request deletion, to correct inaccurate information, and to opt out of the sale or sharing of personal information. Kepton does not sell personal information. Residents of other US states with comparable privacy laws (for example Virginia, Colorado, Connecticut) have similar rights under their respective statutes.',
      },
      { type: 'heading', text: "9.3 India (Digital Personal Data Protection Act, 2023)", level: 3 },
      {
        type: 'paragraph',
        text: 'You have the right to access a summary of your personal data and the processing activities involved, to correction and erasure, to grievance redressal through our Grievance Officer, and to nominate another individual to exercise your rights in the event of death or incapacity.',
      },
      { type: 'heading', text: '9.4 Other Asia-Pacific jurisdictions', level: 3 },
      {
        type: 'paragraph',
        text: "Depending on your location, you may have additional rights under laws such as Australia's Privacy Act 1988, Singapore's Personal Data Protection Act, or similar regional frameworks. We will honor valid requests under the law applicable to you.",
      },
      {
        type: 'paragraph',
        text: 'To exercise any of these rights, email keptonapp@gmail.com. We will respond within the timeframe required by the applicable law (generally 30 days).',
      },
      { type: 'heading', text: "10. Children's Privacy" },
      {
        type: 'paragraph',
        text: 'Kepton requires all users to self-declare that they are at least 16 years old at signup. The Service is not directed at children, and we do not knowingly collect personal data from anyone under 16. If we learn that a user under 16 has provided personal data, we will delete it.',
      },
      { type: 'heading', text: '11. Security' },
      {
        type: 'paragraph',
        text: 'We apply reasonable technical and organizational measures to protect your data, including encrypted connections (HTTPS/TLS), access controls on our database, and dependency and secrets-management hygiene as part of our standard build process. No system is completely secure, and we cannot guarantee absolute security.',
      },
      { type: 'heading', text: '12. Data Breach Notification' },
      {
        type: 'paragraph',
        text: "In the event of a data breach affecting your personal data, we will notify affected users and, where legally required, the relevant supervisory authority, without undue delay and in line with applicable law (for example within 72 hours of becoming aware, where GDPR's notification timeline applies).",
      },
      { type: 'heading', text: '13. Changes to This Policy' },
      {
        type: 'paragraph',
        text: 'We may update this Privacy Policy from time to time. Material changes will be notified through the app or by email at least 14 days before they take effect.',
      },
      { type: 'heading', text: '14. Contact Us' },
      {
        type: 'paragraph',
        text: 'For any privacy question, request, or complaint, contact keptonapp@gmail.com.',
      },
    ],
  },

  subscription: {
    slug: 'subscription-policy',
    title: 'Kepton — Subscription, Cancellation & Refund Policy',
    subtitle:
      'Applies to all Kepton Pro subscriptions purchased through the Apple App Store or Google Play Store',
    effectiveDate: '[PLACEHOLDER: insert publish date]',
    lastUpdated: '[PLACEHOLDER: insert date]',
    blocks: [
      { type: 'heading', text: '1. Plans and Pricing' },
      {
        type: 'list',
        items: [
          'Free tier: core timer, forest, and template-based planner features, at no cost.',
          'Kepton Pro, monthly: INR 749 per month, or the equivalent local price shown at checkout.',
          'Kepton Pro, annual: INR 5,999 per year, or the equivalent local price shown at checkout.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Prices shown in your local currency at checkout are set by the Apple App Store or Google Play Store based on their own pricing and currency conversion tables, and may differ slightly from the INR reference price above.',
      },
      { type: 'heading', text: '2. How Billing Works' },
      {
        type: 'paragraph',
        text: 'All Kepton Pro subscriptions are sold and billed exclusively through the Apple App Store (for iOS users) or the Google Play Store (for Android users). Kepton does not directly process, store, or have access to your payment card details. Your subscription contract for billing purposes is with Apple or Google, under their respective terms, in addition to your agreement with Kepton for use of the Service itself.',
      },
      { type: 'heading', text: '3. Free Trial' },
      {
        type: 'paragraph',
        text: 'Kepton Pro may be offered with a free trial period. The exact trial length is shown at the point of purchase in the app. Unless cancelled before the trial ends, your subscription will automatically convert to a paid subscription and you will be charged the applicable monthly or annual price.',
      },
      { type: 'heading', text: '4. Automatic Renewal' },
      {
        type: 'paragraph',
        text: 'Kepton Pro subscriptions renew automatically at the end of each billing period (monthly or annual) unless cancelled at least 24 hours before the renewal date. You will be charged the then-current price for the next billing period through your Apple ID or Google Play account.',
      },
      {
        type: 'notice',
        text: 'ACTION NEEDED BEFORE PUBLISHING: The US FTC\'s "click-to-cancel" rule and equivalent EU/UK rules require that cancellation be at least as easy as signup, and that renewal terms be disclosed clearly before purchase. Because billing runs through Apple/Google, most of this obligation is satisfied by their storefronts, but make sure your in-app paywall screen also states the price, billing frequency, and auto-renewal terms in plain text before the user taps to subscribe, not only inside store fine print.',
      },
      { type: 'heading', text: '5. How to Cancel' },
      { type: 'heading', text: 'iOS (Apple App Store)', level: 3 },
      {
        type: 'list',
        items: [
          'Open the Settings app on your iPhone or iPad.',
          'Tap your name at the top, then tap "Subscriptions."',
          'Tap "Kepton," then tap "Cancel Subscription."',
        ],
      },
      { type: 'heading', text: 'Android (Google Play Store)', level: 3 },
      {
        type: 'list',
        items: [
          'Open the Google Play Store app.',
          'Tap your profile icon, then "Payments & subscriptions," then "Subscriptions."',
          'Tap "Kepton," then tap "Cancel subscription."',
        ],
      },
      {
        type: 'paragraph',
        text: 'Cancelling stops future renewals but does not refund the current billing period; you retain Pro access until the end of the period you already paid for.',
      },
      { type: 'heading', text: '6. Refunds' },
      {
        type: 'paragraph',
        text: 'Because Apple and Google act as merchant of record for all Kepton Pro purchases, refund requests are handled directly by Apple or Google under their own refund policies, not by Kepton.',
      },
      {
        type: 'list',
        items: [
          'iOS: request a refund at reportaproblem.apple.com, or through Settings > your name > Media & Purchases > request a refund.',
          'Android: request a refund through the Google Play Store order history within the eligible window, or via Google Play support.',
        ],
      },
      {
        type: 'paragraph',
        text: 'If you contact keptonapp@gmail.com about a billing issue, we will help redirect you to the correct Apple or Google refund process, and will assist with any account-side issue (such as restoring access) within our control.',
      },
      { type: 'heading', text: '7. EU / UK 14-Day Withdrawal Right' },
      {
        type: 'paragraph',
        text: 'If you are a consumer in the European Union or United Kingdom, you generally have a 14-day right to withdraw from a digital-content purchase without giving a reason. However, this right is typically lost once you have begun using the digital content or service with your express consent and acknowledgement that you thereby lose the withdrawal right, which is the standard flow presented by Apple and Google at checkout for immediate-access digital subscriptions.',
      },
      {
        type: 'notice',
        text: 'ACTION NEEDED BEFORE PUBLISHING: Confirm that the Apple/Google checkout flow shown to EU/UK users includes the required "you agree to immediate performance and acknowledge loss of your withdrawal right" checkbox equivalent. This is generally handled by the platforms\' own checkout for digital subscriptions, but it is worth confirming for your specific App Store Connect / Play Console configuration before large-scale EU marketing spend.',
      },
      { type: 'heading', text: '8. Price Changes' },
      {
        type: 'paragraph',
        text: 'We may change subscription prices from time to time. Existing subscribers will be notified in advance through the app or by the platform (Apple/Google) as required, and any price increase will only apply to renewals after the notice period, not retroactively.',
      },
      { type: 'heading', text: '9. Taxes' },
      {
        type: 'paragraph',
        text: 'Prices shown may or may not include applicable sales tax, VAT, or GST depending on your country; Apple and Google calculate and remit these taxes as part of their platform billing in most jurisdictions.',
      },
      { type: 'heading', text: '10. Contact' },
      {
        type: 'paragraph',
        text: 'For any subscription question not resolved by Apple or Google support, email keptonapp@gmail.com.',
      },
    ],
  },

  health: {
    slug: 'health-disclaimer',
    title: 'Kepton — Health & Wellness Disclaimer',
    subtitle:
      'Please read this before you rely on Kepton for anything related to ADHD or focus difficulties',
    effectiveDate: '[PLACEHOLDER: insert publish date]',
    blocks: [
      {
        type: 'paragraph',
        text: 'This document is incorporated by reference into the Kepton Terms & Conditions.',
      },
      { type: 'heading', text: '1. Kepton Is Not a Medical Product' },
      {
        type: 'paragraph',
        text: 'Kepton is a general productivity and wellness application. It uses a timer-based focus system and a visual "forest growth" mechanic to help you structure tasks and build consistent habits. Kepton is marketed to, and may be especially useful for, people who experience attention and focus difficulties, including people with ADHD. Marketing Kepton to this audience does not make Kepton a medical product.',
      },
      {
        type: 'list',
        items: [
          'Kepton is not a medical device.',
          'Kepton is not a diagnostic tool, and no feature of the app should be interpreted as diagnosing ADHD or any other condition.',
          'Kepton is not therapy, counselling, or a clinical treatment, and does not replace either.',
          'Kepton has not been evaluated or approved by any medical regulatory body (such as the FDA, MHRA, or CDSCO) as a treatment for ADHD or any other condition, because it is not intended to be one.',
        ],
      },
      { type: 'heading', text: '2. No Professional Advice' },
      {
        type: 'paragraph',
        text: 'Nothing in the Service, including in-app content, planning suggestions, onboarding questions, or marketing materials, constitutes medical, psychological, or psychiatric advice. Always seek the guidance of a qualified physician, psychiatrist, psychologist, or other licensed healthcare provider with any questions you may have about ADHD, focus difficulties, or any other health condition. Never disregard professional medical advice, or delay seeking it, because of something you experienced while using Kepton.',
      },
      { type: 'heading', text: '3. Onboarding Questions' },
      {
        type: 'paragraph',
        text: 'The preference questions Kepton asks during onboarding relate to your general energy levels and working style. They are used only to select which planning template to show you. They are not a clinical screening tool, are not scored against any diagnostic criteria, and your answers are not reviewed by any healthcare professional.',
      },
      {
        type: 'notice',
        text: 'ACTION NEEDED BEFORE PUBLISHING: This paragraph is only accurate if the onboarding survey truly stays limited to general working-style and energy questions. If you add anything resembling a symptom checklist, a validated screening instrument (for example anything resembling the ASRS), or a direct "do you have ADHD" question, this document, the Privacy Policy\'s data classification, and your GDPR/DPDP legal basis all need to be revisited before that feature ships.',
      },
      { type: 'heading', text: '4. If You Are in Crisis' },
      {
        type: 'paragraph',
        text: 'Kepton is not equipped to respond to mental health emergencies. If you are experiencing a crisis, having thoughts of self-harm, or need urgent support, please contact your local emergency services immediately, or a crisis helpline in your country (for example 988 in the United States, 111 in the United Kingdom for non-emergencies or 999 for emergencies, or your local equivalent).',
      },
      { type: 'heading', text: '5. Your Responsibility' },
      {
        type: 'paragraph',
        text: 'You are solely responsible for how you use Kepton and for any decisions you make about your health, work, or daily routine based on your use of the app. Kepton disclaims all liability for outcomes related to health, medical, or psychological matters, to the fullest extent permitted by law, as further described in the Terms & Conditions.',
      },
    ],
  },
}

export function getPolicy(key: keyof typeof policies): PolicyDocument {
  return policies[key]
}
