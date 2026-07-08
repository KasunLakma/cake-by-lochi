import { defineConfig } from '@prisma/config'

export default defineConfig({
  datasource: {
    url: "postgresql://neondb_owner:npg_vndvBNt1DONg@ep-lingering-salad-a5ipt27d-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
})
