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

    // 手机端：把"利润 / 期望利润（No RNG Profit）"两行移到黑暗模式开关下方，
    // 使其显示在模拟结果上方，减少滚动查找；桌面端不移动。
    function moveProfitBlock() {
        if (!mq.matches) return;

        var profitPreview = document.getElementById('profitPreview');
        var noRngPreview = document.getElementById('noRngProfitPreview');
        var toggle = document.getElementById('darkModeToggle');
        if (!profitPreview || !noRngPreview || !toggle) return;

        var profitRow = profitPreview.closest('.row');
        var noRngRow = noRngPreview.closest('.row');
        if (!profitRow || !noRngRow) return;

        var darkCol = toggle.closest('.col-md-auto');
        if (!darkCol || !darkCol.parentElement) return;
        var targetRow = darkCol.parentElement;      // 黑暗模式所在行
        var parent = targetRow.parentElement;       // 该行的父容器
        if (!parent) return;

        // 已移动过则跳过（防止重复执行）
        if (parent.contains(profitRow) || parent.contains(noRngRow)) return;

        // 插到黑暗模式行后面（作为独立行显示在模拟结果上方）
        parent.insertBefore(noRngRow, targetRow.nextSibling);
        parent.insertBefore(profitRow, targetRow.nextSibling);
    }

    moveProfitBlock();
    if (mq.addEventListener) {
        mq.addEventListener('change', moveProfitBlock);
    } else if (mq.addListener) {
        mq.addListener(moveProfitBlock);
    }

    // 手机端：战斗属性（Combat Stats）默认折叠，点击标题展开/收起
    // 只做视觉折叠，不改变任何元素 id / 数据，bundle.js 写入不受影响
    function setupCollapsibleCombatStats() {
        if (!mq.matches) return;

        var col = document.querySelector('.row.pt-3 > .col-md-2');
        if (!col || col.dataset.mwStatsDone) return;
        col.dataset.mwStatsDone = '1';

        var titleRow = col.querySelector(':scope > .row.mb-3');
        if (!titleRow) return;

        // 把除标题外的所有内容行收进一个容器
        var content = document.createElement('div');
        content.className = 'mw-stats-content';
        var kids = col.children;
        for (var i = kids.length - 1; i >= 0; i--) {
            if (kids[i] !== titleRow) {
                content.insertBefore(kids[i], content.firstChild);
            }
        }
        col.appendChild(content);
        content.style.display = 'none';

        titleRow.style.cssText =
            'display:flex;align-items:center;justify-content:space-between;' +
            'cursor:pointer;user-select:none;padding:6px 0;margin-bottom:0;';
        var caret = document.createElement('span');
        caret.textContent = '▶';
        caret.style.cssText = 'font-size:12px;color:#6c757d;';
        titleRow.appendChild(caret);

        titleRow.addEventListener('click', function () {
            var open = content.style.display !== 'none';
            content.style.display = open ? 'none' : 'block';
            caret.textContent = open ? '▶' : '▼';
        });
    }

    setupCollapsibleCombatStats();
    if (mq.addEventListener) {
        mq.addEventListener('change', setupCollapsibleCombatStats);
    } else if (mq.addListener) {
        mq.addListener(setupCollapsibleCombatStats);
    }
})();
