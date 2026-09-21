# سیستم مدیریت انبار - Warehouse Management System

یک نرم‌افزار مدیریت انبار کامل و واقعی با استفاده از Next.js، TypeScript و SQLite.

## 🎯 ویژگی‌ها

- **Full Stack Server Application** - تمام منطق برنامه در سمت سرور اجرا می‌شود
- **SQLite Database** - ذخیره‌سازی داده‌ها در یک فایل SQLite روی سرور
- **Multi-User Support** - چندین کاربر به یک دیتابیس مشترک متصل می‌شوند
- **رابط فارسی RTL** - طراحی واکنش‌گرا با پشتیبانی از زبان فارسی
- **ماژول‌های کامل**:
  - Dashboard (داشبورد)
  - Products (محصولات)
  - Categories (دسته‌بندی‌ها)
  - Stock In (ورود کالا)
  - Stock Out (خروج کالا)
  - Stock Movements (گردش کالا)
  - Inventory (موجودی)
  - Reports (گزارشات)
  - Settings (تنظیمات)

## 🏗️ معماری پروژه

```
User Browser
      |
      v
Next.js Application (Node.js Server)
      |
      v
SQLite Database File (./data/inventory.db)
```

### نکات مهم معماری:
- ✅ دیتابیس SQLite فقط در سمت سرور اجرا می‌شود
- ✅ همه کاربران به یک فایل SQLite مشترک متصل می‌شوند
- ✅ اطلاعات اصلی در سرور ذخیره می‌شود (نه در مرورگر)
- ❌ بدون localStorage یا sessionStorage برای داده‌های اصلی
- ❌ بدون SQLite داخل Browser

## 📦 پیش‌نیازها

- Node.js نسخه 18 یا بالاتر
- npm یا yarn

## 🚀 نصب و راه‌اندازی

### روش سریع (ویندوز)

فایل `quickstart.bat` را اجرا کنید. این فایل تمام مراحل زیر را به صورت خودکار انجام می‌دهد:

```bash
quickstart.bat
```

### روش دستی

#### 1. نصب وابستگی‌ها

```bash
npm install
```

#### 2. ایجاد پوشه data

```bash
mkdir data
```

#### 3. تنظیم Environment Variables

فایل `.env` را ایجاد کنید:

```env
DATABASE_PATH=./data/inventory.db
```

#### 4. اجرای مهاجرت‌های دیتابیس

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

#### 5. اجرای Seed داده‌های اولیه

```bash
node -r esbuild-register src/db/seed.ts
```

یا از طریق npm script (اگر تعریف شده باشد):

```bash
npm run db:seed
```

## 🔧 فایل‌های BAT (ویندوز)

| فایل | توضیح |
|------|-------|
| `setup.bat` | نصب وابستگی‌ها و راه‌اندازی دیتابیس |
| `dev.bat` | اجرای سرور توسعه |
| `build.bat` | بیلد پروژه برای پروداکشن |
| `start.bat` | اجرای سرور پروداکشن |
| `reset-db.bat` | حذف و ایجاد مجدد دیتابیس |
| `quickstart.bat` | اجرای تمام مراحل به صورت خودکار |

## 📁 ساختار پروژه

```
/workspace
├── data/                    # پوشه دیتابیس
│   └── inventory.db        # فایل SQLite
├── src/
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   │   ├── categories/
│   │   │   ├── products/
│   │   │   ├── stock-movements/
│   │   │   ├── inventory/
│   │   │   ├── dashboard/
│   │   │   └── reports/
│   │   └── globals.css
│   ├── db/
│   │   ├── db.ts           # اتصال به دیتابیس
│   │   ├── schema.ts       # طرح دیتابیس
│   │   ├── seed.ts         # داده‌های اولیه
│   │   ├── category-service.ts
│   │   ├── product-service.ts
│   │   ├── stock-movement-service.ts
│   │   ├── inventory-service.ts
│   │   ├── dashboard-service.ts
│   │   └── report-service.ts
│   ├── components/         # کامپوننت‌های React
│   ├── hooks/             # Custom hooks
│   └── lib/               # توابع کمکی
├── .env                   # Environment variables
├── .env.example          # نمونه Environment variables
├── next.config.js        # تنظیمات Next.js
├── tailwind.config.js    # تنظیمات Tailwind CSS
├── postcss.config.js     # تنظیمات PostCSS
├── tsconfig.json         # تنظیمات TypeScript
└── package.json          # وابستگی‌ها و اسکریپت‌ها
```

## 🗄️ دیتابیس

### جداول

#### categories
- id (INTEGER, PRIMARY KEY)
- name (TEXT, UNIQUE)
- description (TEXT)
- created_at (TEXT)
- updated_at (TEXT)

#### products
- id (INTEGER, PRIMARY KEY)
- name (TEXT)
- sku (TEXT, UNIQUE)
- category_id (INTEGER, REFERENCES categories)
- description (TEXT)
- unit (TEXT, default: 'عدد')
- min_stock (INTEGER, default: 0)
- created_at (TEXT)
- updated_at (TEXT)

#### stock_movements
- id (INTEGER, PRIMARY KEY)
- product_id (INTEGER, REFERENCES products)
- type (TEXT: 'in', 'out', 'adjustment')
- quantity (INTEGER)
- reference_number (TEXT)
- notes (TEXT)
- created_at (TEXT)

### منطق موجودی

موجودی هر محصول از طریق گردش کالا محاسبه می‌شود:

```
موجودی = مجموع ورودی‌ها - مجموع خروجی‌ها + مجموع اصلاحات
```

⚠️ **نکته مهم**: موجودی مستقیماً در جدول محصولات ذخیره نمی‌شود. سرویس `inventory-service` مسئول محاسبه موجودی از روی جدول `stock_movements` است.

## 🌐 API Endpoints

### Categories

| Method | Endpoint | توضیح |
|--------|----------|-------|
| GET | `/api/categories` | دریافت همه دسته‌بندی‌ها |
| POST | `/api/categories` | ایجاد دسته‌بندی جدید |
| GET | `/api/categories/:id` | دریافت دسته‌بندی بر اساس ID |
| PUT | `/api/categories/:id` | بروزرسانی دسته‌بندی |
| DELETE | `/api/categories/:id` | حذف دسته‌بندی |

### Products

| Method | Endpoint | توضیح |
|--------|----------|-------|
| GET | `/api/products` | دریافت همه محصولات |
| POST | `/api/products` | ایجاد محصول جدید |
| GET | `/api/products/:id` | دریافت محصول بر اساس ID |
| PUT | `/api/products/:id` | بروزرسانی محصول |
| DELETE | `/api/products/:id` | حذف محصول |

### Stock Movements

| Method | Endpoint | توضیح |
|--------|----------|-------|
| GET | `/api/stock-movements` | دریافت همه حرکات |
| POST | `/api/stock-movements` | ثبت حرکت جدید |

### Inventory

| Method | Endpoint | توضیح |
|--------|----------|-------|
| GET | `/api/inventory` | دریافت موجودی همه محصولات |

### Dashboard

| Method | Endpoint | توضیح |
|--------|----------|-------|
| GET | `/api/dashboard` | دریافت آمار و اطلاعات داشبورد |

### Reports

| Method | Endpoint | توضیح |
|--------|----------|-------|
| GET | `/api/reports?type=<type>` | دریافت گزارش‌ها |

انواع گزارش‌ها:
- `summary` - خلاصه وضعیت
- `movements` - گزارش حرکات کالا
- `products` - گزارش محصولات
- `categories` - گزارش دسته‌بندی‌ها
- `monthly` - گزارش ماهانه

## 🏃‍♂️ اجرا

### حالت توسعه (Development)

```bash
npm run dev
```

سپس مرورگر را باز کنید و به آدرس `http://localhost:3000` بروید.

### حالت پروداکشن (Production)

```bash
# بیلد پروژه
npm run build

# اجرای سرور پروداکشن
npm run start
```

## 📊 داده‌های اولیه (Seed Data)

پروژه شامل داده‌های تستی زیر است:

- **5 دسته‌بندی**: الکترونیک، لوازم خانگی، ابزارآلات، مواد غذایی، لوازم تحریر
- **20 محصول**: محصولات متنوع در هر دسته‌بندی
- **حرکات کالا**: شامل ورود، خروج و اصلاحات

## 🔒 امنیت و بهترین روش‌ها

- ✅ استفاده از Parameterized Query برای جلوگیری از SQL Injection
- ✅ Validation داده‌های ورودی در API
- ✅ Error Handling کامل در سمت سرور
- ✅ Logging عملیات در سرور
- ✅ عدم ذخیره داده‌های حساس در کلاینت

## 🛠️ تکنولوژی‌ها

- **Frontend & Backend**: Next.js 14
- **Language**: TypeScript
- **Database**: SQLite
- **ORM**: Drizzle ORM
- **Database Driver**: better-sqlite3
- **Styling**: Tailwind CSS
- **Runtime**: Node.js

## 📝 Environment Variables

| Variable | Default | توضیح |
|----------|---------|-------|
| `DATABASE_PATH` | `./data/inventory.db` | مسیر فایل دیتابیس SQLite |

## 🐛 عیب‌یابی

### دیتابیس ساخته نمی‌شود

مطمئن شوید پوشه `data` وجود دارد:

```bash
mkdir data
```

### خطا در نصب وابستگی‌ها

کش npm را پاک کنید:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### خطا در بیلد

مطمئن شوید تمام وابستگی‌ها نصب شده‌اند:

```bash
npm install
```

## 📄 لایسنس

ISC

## 👨‍💻 توسعه‌دهنده

این پروژه به عنوان یک نمونه کامل از یک برنامه Full Stack با Next.js و SQLite ایجاد شده است.

---

## ⚠️ توجه مهم

این پروژه یک **Server Application** واقعی است، نه یک Demo فرانت‌اند. تمام داده‌ها در SQLite روی سرور ذخیره می‌شوند و چندین کاربر می‌توانند همزمان به همان داده‌ها دسترسی داشته باشند.
