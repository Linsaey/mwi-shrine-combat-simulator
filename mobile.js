/* ==========================================================================
   MWI Shrine Combat Simulator — 移动端适配脚本（独立文件）
   生效范围：max-width: 767.98px（手机 / 小平板竖屏）
   桌面端（>=768px）不受影响；窗口在手机/桌面间切换时自动同步。
   本文件只调整移动端交互体验，不修改任何模拟逻辑。
   删除本文件的 <script> 引用即可 100% 回滚。
   ========================================================================== */

(function () {
    'use strict';

    // 玩家标签（Player 1~5）：桌面端用 contenteditable 支持改名，
    // 手机端点击会弹出输入法编辑框。手机端移除该属性，切换角色不弹键盘；
    // 回到桌面宽度时自动恢复，改名功能不受影响。
    var mq = window.matchMedia('(max-width: 767.98px)');

    function syncPlayerTabs() {
        document.querySelectorAll('#playerTab .nav-link').forEach(function (el) {
            if (mq.matches) {
                el.removeAttribute('contenteditable');
            } else if (!el.hasAttribute('contenteditable')) {
                el.setAttribute('contenteditable', 'true');
            }
        });
    }

    syncPlayerTabs();

    if (mq.addEventListener) {
        mq.addEventListener('change', syncPlayerTabs);
    } else if (mq.addListener) {
        mq.addListener(syncPlayerTabs);
    }
})();
