import type { WebsiteTarget } from "./types.js";

export const BENCHMARK_WEBSITES: WebsiteTarget[] = [
    // 1. Search, DNS & Core Infrastructure
    { name: "Google", domain: "google.com", category: "Search / Infra", url: "https://www.google.com/generate_204" },
    { name: "Cloudflare", domain: "cloudflare.com", category: "CDN / Infra", url: "https://www.cloudflare.com/favicon.ico" },
    { name: "Cloudflare DNS", domain: "1.1.1.1", category: "DNS / Infra", url: "https://1.1.1.1/cdn-cgi/trace" },
    { name: "Microsoft", domain: "microsoft.com", category: "Search / Tech", url: "https://www.microsoft.com" },
    { name: "Apple", domain: "apple.com", category: "Tech / Infra", url: "https://www.apple.com" },
    { name: "Bing", domain: "bing.com", category: "Search", url: "https://www.bing.com" },
    { name: "DuckDuckGo", domain: "duckduckgo.com", category: "Search", url: "https://duckduckgo.com" },
    { name: "Yahoo", domain: "yahoo.com", category: "Portal / Search", url: "https://www.yahoo.com" },

    // 2. Developer Platforms & CDNs
    { name: "GitHub", domain: "github.com", category: "Developer", url: "https://github.com" },
    { name: "GitLab", domain: "gitlab.com", category: "Developer", url: "https://gitlab.com" },
    { name: "Stack Overflow", domain: "stackoverflow.com", category: "Developer", url: "https://stackoverflow.com" },
    { name: "NPM Registry", domain: "npmjs.com", category: "Developer", url: "https://registry.npmjs.org" },
    { name: "Docker Hub", domain: "docker.com", category: "Developer", url: "https://hub.docker.com" },
    { name: "Mozilla MDN", domain: "developer.mozilla.org", category: "Developer", url: "https://developer.mozilla.org" },
    { name: "Bitbucket", domain: "bitbucket.org", category: "Developer", url: "https://bitbucket.org" },
    { name: "CDNJS", domain: "cdnjs.cloudflare.com", category: "Developer CDN", url: "https://cdnjs.cloudflare.com/robots.txt" },

    // 3. AI & Next-Gen Tech
    { name: "OpenAI", domain: "openai.com", category: "AI / Tech", url: "https://openai.com" },
    { name: "Hugging Face", domain: "huggingface.co", category: "AI / Developer", url: "https://huggingface.co" },

    // 4. Media, Video & Entertainment
    { name: "YouTube", domain: "youtube.com", category: "Media / Video", url: "https://www.youtube.com/generate_204" },
    { name: "Netflix", domain: "netflix.com", category: "Media / Streaming", url: "https://www.netflix.com" },
    { name: "Spotify", domain: "spotify.com", category: "Media / Audio", url: "https://www.spotify.com" },
    { name: "Twitch", domain: "twitch.tv", category: "Media / Live", url: "https://www.twitch.tv" },
    { name: "Vimeo", domain: "vimeo.com", category: "Media / Video", url: "https://vimeo.com" },
    { name: "SoundCloud", domain: "soundcloud.com", category: "Media / Audio", url: "https://soundcloud.com" },

    // 5. Social Media & Communication
    { name: "Reddit", domain: "reddit.com", category: "Social / Community", url: "https://www.reddit.com" },
    { name: "Wikipedia", domain: "wikipedia.org", category: "Reference", url: "https://en.wikipedia.org" },
    { name: "X / Twitter", domain: "x.com", category: "Social Media", url: "https://x.com" },
    { name: "LinkedIn", domain: "linkedin.com", category: "Social / Business", url: "https://www.linkedin.com" },
    { name: "Instagram", domain: "instagram.com", category: "Social Media", url: "https://www.instagram.com" },
    { name: "Discord", domain: "discord.com", category: "Communication", url: "https://discord.com" },
    { name: "Telegram", domain: "telegram.org", category: "Communication", url: "https://telegram.org" },
    { name: "Slack", domain: "slack.com", category: "Communication", url: "https://slack.com" },
    { name: "Pinterest", domain: "pinterest.com", category: "Social / Discovery", url: "https://www.pinterest.com" },
    { name: "Quora", domain: "quora.com", category: "Social / Q&A", url: "https://www.quora.com" },
    { name: "Tumblr", domain: "tumblr.com", category: "Social / Blogging", url: "https://www.tumblr.com" },
    { name: "Medium", domain: "medium.com", category: "Social / Publishing", url: "https://medium.com" },

    // 6. E-Commerce & Payments
    { name: "Amazon", domain: "amazon.com", category: "E-Commerce", url: "https://www.amazon.com" },
    { name: "eBay", domain: "ebay.com", category: "E-Commerce", url: "https://www.ebay.com" },
    { name: "PayPal", domain: "paypal.com", category: "Fintech / Payment", url: "https://www.paypal.com" },
    { name: "Stripe", domain: "stripe.com", category: "Fintech / Payment", url: "https://stripe.com" },
    { name: "Booking.com", domain: "booking.com", category: "Travel / Hospitality", url: "https://www.booking.com" },
    { name: "Airbnb", domain: "airbnb.com", category: "Travel / Hospitality", url: "https://www.airbnb.com" },
    { name: "AliExpress", domain: "aliexpress.com", category: "E-Commerce", url: "https://www.aliexpress.com" },
    { name: "Shopify", domain: "shopify.com", category: "E-Commerce", url: "https://www.shopify.com" },

    // 7. News & Information
    { name: "BBC", domain: "bbc.com", category: "News", url: "https://www.bbc.com" },
    { name: "CNN", domain: "cnn.com", category: "News", url: "https://www.cnn.com" },
    { name: "The New York Times", domain: "nytimes.com", category: "News", url: "https://www.nytimes.com" },
    { name: "The Guardian", domain: "theguardian.com", category: "News", url: "https://www.theguardian.com" },
    { name: "Reuters", domain: "reuters.com", category: "News / Finance", url: "https://www.reuters.com" },

    // 8. Productivity & Cloud
    { name: "Dropbox", domain: "dropbox.com", category: "Cloud Storage", url: "https://www.dropbox.com" },
    { name: "Salesforce", domain: "salesforce.com", category: "Enterprise / SaaS", url: "https://www.salesforce.com" },
    { name: "Adobe", domain: "adobe.com", category: "Design / Creative", url: "https://www.adobe.com" },
    { name: "Zoom", domain: "zoom.us", category: "Video Conferencing", url: "https://zoom.us" },
];
