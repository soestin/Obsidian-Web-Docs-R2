# Obsidian Web Docs with R2

Easily deploy your Obsidian notes as a website using Cloudflare Workers and R2, synchronized via the [**Remotely Sync**](https://github.com/sboesen/remotely-sync) plugin.

## Features
- Host your Obsidian notes as a static website.
- Seamless synchronization with Cloudflare R2 using the **Remotely Save** plugin.
- Lightweight and fast deployment using Cloudflare Workers.

## Prerequisites
1. An Obsidian vault with notes you want to publish.
2. The **Remotely Sync** plugin installed and configured to sync your notes with Cloudflare R2.
3. A Cloudflare account with Workers and R2 enabled.

## Installation & Setup
1. Clone this repository:
   ```bash
   git clone https://github.com/soestin/Obsidian-Web-Docs-R2.git
   ```
2. Configure your Cloudflare Worker script to point to your R2 bucket.
3. Deploy the Worker to serve your notes as a website.

## Usage
1. Sync your Obsidian notes to R2 using the **Remotely Sync** plugin.
2. Access your notes through the deployed website.

