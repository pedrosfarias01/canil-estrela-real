# Canil Estrela Real: website

A one-page static site: plain HTML and CSS plus a little JavaScript. No install and no build step.

**To view it locally:** double-click `index.html`.

## Files

| File | What it is |
|---|---|
| `index.html` | All the page content (text, dogs, photos) |
| `style.css` | Colours, fonts and layout (colours are at the top) |
| `script.js` | **Settings at the top** (WhatsApp, Instagram, city, form URL) and the form logic |
| `apps_script.gs` | Code you paste into Google Sheets once, so the form saves sign-ups there |
| `images/` | Photos. Placeholders are labelled with their filename. |

---

## 1. Replace the photos

Put the real photos in `images/` **using the same filenames** and the site picks them up automatically:

- `cao-1.jpg` … `cao-4.jpg`: dog cards (portrait works best)
- `estrutura-1.jpg` … `estrutura-6.jpg`: the space (landscape)
- `hotel.jpg`, `filhotes.jpg`: landscape
- `logo.jpg`: replace with a higher-quality logo when available

Tip: resize photos to about 1200px wide before adding them. Phone photos are 4–8 MB and make the site slow. One way in Python:

```python
from PIL import Image
im = Image.open("photo.jpg"); im.thumbnail((1200, 1200)); im.save("images/cao-1.jpg", quality=82)
```

## 2. Edit the text

Open `index.html` in VS Code and edit the text between the tags. Each section starts with a comment such as `<!-- ============ NOSSOS CÃES ============ -->`.

- **Add or remove a dog:** copy or delete a whole `<article class="dog"> … </article>` block.
- **New litter:** update the box under `<!-- Atualize este quadro a cada ninhada -->`. You can change the badge text to `Filhotes disponíveis` when puppies are born.

## 3. Settings

At the top of `script.js`:

```js
whatsapp: "5511912345678",   // 55 + area code + number, digits only
instagram: "canilestrelareal",
cidade: "Cidade · UF",
formEndpoint: "https://script.google.com/macros/s/.../exec",
```

---

## 4. Google Sheet (where the sign-ups go)

Do this once, ideally logged in to **your cousin's Google account**, so he owns the data.

1. Create a new Google Sheet, for example "Canil – Interessados".
2. Go to **Extensions → Apps Script**. Delete what's there and paste the full contents of `apps_script.gs`.
   - Optional: fill in `NOTIFY_EMAIL` to get an email for every new sign-up.
3. Click **Save** (disk icon).
4. Click **Deploy → New deployment**. Click the gear icon, choose **Web app**, then set:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy** and authorize. Google shows a "this app isn't verified" warning. Click **Advanced → Go to (project name)**. This is normal for your own script.
6. Copy the **Web app URL** (it ends in `/exec`) and paste it into `formEndpoint` in `script.js`.
7. Test: open the site, submit the form, and check that a row appears in the **Interessados** tab.

The sheet has a **Status** column that starts as `Novo`. Your cousin can update it (`Contatado`, `Reservado`, `Desistiu`…) and use it as the queue, in signup order.

> ⚠️ If you change `apps_script.gs` later, go to **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. Otherwise the old code keeps running.
>
> 🔒 Keep the sheet private. It holds people's phone numbers (LGPD).

---

## 5. Publish (GitHub Pages, free)

1. On github.com, create a new **public** repository, for example `canil-estrela-real`.
2. In this folder:
   ```bash
   git init
   git add .
   git commit -m "Site Canil Estrela Real"
   git branch -M main
   git remote add origin https://github.com/YOUR_USER/canil-estrela-real.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
4. After about a minute, the site is live at `https://YOUR_USER.github.io/canil-estrela-real/`.

To update the site later: edit the files, then run `git add . && git commit -m "update" && git push`.

**Custom domain (optional):** register `canilestrelareal.com.br` at registro.br. Then fill in **Settings → Pages → Custom domain** on GitHub and follow its DNS instructions.
