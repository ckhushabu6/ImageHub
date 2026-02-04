# 🖼️ ImageHub

**Studio Minimalist Image Management & Discovery Platform**

ImageHub is a premium web application designed for creators to manage visual assets. Built with a "Studio" aesthetic, it combines a high-contrast minimalist interface with powerful cloud storage and personalized content discovery.

---

## 📸 Preview



## ✨ Core Features

* **Asset Management:** Create your own library by uploading images directly to the cloud.
* **Public Exploration:** Integrated with the **Picsum API** to provide random inspiration for guest users.
* **Smart Feed:** Personalized recommendations based on user-selected categories and interests.
* **Responsive Engine:** Fully adaptive layout—from mobile drawers to 4-column desktop masonry grids.
* **Secure Auth:** Firebase-powered authentication and real-time database integration.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React.js (v17) |
| **Styling** | Tailwind CSS |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Auth |
| **Storage** | Cloudinary API |
| **Navigation** | React Router DOM |

---

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/imagehub.git](https://github.com/your-username/imagehub.git)
cd imagehub
### 2.Install dependencies
Bash
npm install

###3. Environment Configuration
Create a .env file in the root directory and add your keys:


Code snippet
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

4. Run Development Server
Bash
npm run dev