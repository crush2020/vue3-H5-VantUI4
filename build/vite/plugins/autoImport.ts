/**
 * @name AutoImportDeps
 * @description 按需加载，自动引入
 */

import AutoImport from 'unplugin-auto-import/vite';
import { VarletUIResolver, VantResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import IconsResolver from 'unplugin-icons/resolver';

export const AutoImportDeps = () => {
  return AutoImport({
    dts: 'types/auto-imports.d.ts',
    imports: [
      'vue',
      'pinia',
      'vue-router',
      {
        '@vueuse/core': [],
      },
    ],
    eslintrc: {
      enabled: true,
    },
    resolvers: [
      VarletUIResolver(),
      VantResolver(),
      ElementPlusResolver(),
      IconsResolver({
        prefix: 'Icon',
      }),
    ],
  });
};
