import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite Configuration File
 * 
 * Configures the build pipeline, React compilation plugins,
 * and the deployment path mapping.
 */
export default defineConfig({
  // React plugin for Fast Refresh and JSX translation
  plugins: [react()],
  
  // Set base path to relative ('./') so compiled assets resolve correctly
  // regardless of hosting domain roots or sub-folder deployment subpaths.
  base: './'
})
