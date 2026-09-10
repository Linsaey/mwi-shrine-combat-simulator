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
            'flex-wrap:nowrap;cursor:pointer;user-select:none;padding:6px 0;margin-bottom:0;';
        var b = titleRow.querySelector('b');
        if (b) {
            b.style.cssText = 'flex:0 0 auto;width:auto;';
        }
        var caret = document.createElement('span');
        caret.textContent = '▶';
        caret.style.cssText = 'font-size:12px;color:#6c757d;flex:0 0 auto;width:auto;margin-left:auto;';
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

    // 紧凑模式：主页面"开始模拟"按钮以上的选择框/输入框外框高度减半、行距减半
    // （样式见 mobile.css html.mwi-compact 规则）。切换按钮放在战斗属性下方，
    // 选择存入 localStorage，默认标准模式。只改视觉，不影响任何功能。
    function setupCompactModeToggle() {
        if (!mq.matches) return;

        var col = document.querySelector('.row.pt-3 > .col-md-2');
        if (!col || col.dataset.mwCompactDone) return;
        col.dataset.mwCompactDone = '1';

        var btn = document.createElement('button');
        btn.id = 'mwiCompactToggle';
        btn.type = 'button';

        function refresh() {
            var on = document.documentElement.classList.contains('mwi-compact');
            btn.textContent = on ? '切换到标准模式' : '切换到紧凑模式';
        }

        // 初始化：读取上次选择
        try {
            if (localStorage.getItem('mwiCompactMode') === '1') {
                document.documentElement.classList.add('mwi-compact');
            }
        } catch (e) {}

        btn.addEventListener('click', function () {
            var on = document.documentElement.classList.toggle('mwi-compact');
            try { localStorage.setItem('mwiCompactMode', on ? '1' : '0'); } catch (e) {}
            refresh();
        });

        refresh();
        col.appendChild(btn);
    }

    setupCompactModeToggle();
    if (mq.addEventListener) {
        mq.addEventListener('change', setupCompactModeToggle);
    } else if (mq.addListener) {
        mq.addListener(setupCompactModeToggle);
    }

    // 手机端：专业等级（8 个）分成两列 —— 战斗/耐力/智力/攻击 一列，近战/防御/远程/魔法 一列
    // 仅调整布局，元素 id / 数据不变，bundle.js 读写不受影响
    function splitLevelsIntoColumns() {
        if (!mq.matches) return;

        var rows = document.querySelectorAll('.row:has(> .col-md-6 > input[id^="inputLevel_"])');
        if (!rows.length) return;
        var parent = rows[0].parentElement;
        if (!parent || parent.dataset.mwLevelsDone) return;
        parent.dataset.mwLevelsDone = '1';

        var wrapper = document.createElement('div');
        wrapper.style.cssText = 'display:flex;gap:10px;align-items:flex-start;';
        var left = document.createElement('div');
        var right = document.createElement('div');
        left.style.cssText = 'flex:1 1 0%;min-width:0;';
        right.style.cssText = 'flex:1 1 0%;min-width:0;';
        wrapper.appendChild(left);
        wrapper.appendChild(right);

        parent.insertBefore(wrapper, rows[0]);
        var half = Math.ceil(rows.length / 2);
        Array.prototype.forEach.call(rows, function (r, i) {
            (i < half ? left : right).appendChild(r);
        });
    }

    // 手机端：食物 / 饮料 分成两列 —— 左列食物（标题+3 行），右列饮料（标题+3 行）
    function splitFoodDrinksIntoColumns() {
        if (!mq.matches) return;

        var foodRows = document.querySelectorAll('.row:has(> .col > select[id^="selectFood_"])');
        var drinkRows = document.querySelectorAll('.row:has(> .col > select[id^="selectDrink_"])');
        if (!foodRows.length || !drinkRows.length) return;

        var parent = foodRows[0].parentElement;
        if (!parent || parent.dataset.mwFoodDrinksDone) return;

        // 找区域标题行（该区第一行之前最近的 .row.mb-3）
        function findTitle(row) {
            var sib = row.previousElementSibling;
            while (sib && !(sib.classList.contains('row') && sib.classList.contains('mb-3'))) {
                sib = sib.previousElementSibling;
            }
            return sib;
        }

        var foodTitle = findTitle(foodRows[0]);
        var drinkTitle = findTitle(drinkRows[0]);
        if (!foodTitle || !drinkTitle || foodTitle === drinkTitle) return;
        parent.dataset.mwFoodDrinksDone = '1';

        var wrapper = document.createElement('div');
        wrapper.style.cssText = 'display:flex;gap:10px;align-items:flex-start;';
        var left = document.createElement('div');
        var right = document.createElement('div');
        left.style.cssText = 'flex:1 1 0%;min-width:0;';
        right.style.cssText = 'flex:1 1 0%;min-width:0;';
        wrapper.appendChild(left);
        wrapper.appendChild(right);

        parent.insertBefore(wrapper, foodTitle);

        left.appendChild(foodTitle);
        Array.prototype.forEach.call(foodRows, function (r) { left.appendChild(r); });

        right.appendChild(drinkTitle);
        Array.prototype.forEach.call(drinkRows, function (r) { right.appendChild(r); });
    }

    splitLevelsIntoColumns();
    splitFoodDrinksIntoColumns();

    // 手机端：模拟结果 7 项（击杀/死亡/经验/消耗品/法力消耗/生命恢复/法力恢复）数值移到标题同一行、右对齐
    function inlineSimResultNumbers() {
        if (!mq.matches) return;
        var ids = [
            'simulationResultKills',
            'simulationResultPlayerDeaths',
            'simulationResultExperienceGain',
            'simulationResultConsumablesUsed',
            'simulationResultManaUsed',
            'simulationResultHealthRestored',
            'simulationResultManaRestored'
        ];
        ids.forEach(function (id) {
            var div = document.getElementById(id);
            if (!div || div.dataset.mwInlineDone) return;
            var row = div.previousElementSibling;
            if (!row || !row.classList.contains('row')) return;
            div.dataset.mwInlineDone = '1';
            row.classList.add('mw-inline-row');
            row.appendChild(div);
        });
    }

    // 手机端：模拟结果重排——每秒恢复的法力值移到每小时经验值下面；每小时使用的消耗品移到总伤害上面
    function reorderSimResultPanels() {
        if (!mq.matches) return;
        // 1) 每秒恢复的法力值 → 每小时经验值下面
        var expDiv = document.getElementById('simulationResultExperienceGain');
        var expBlock = expDiv ? (expDiv.closest('.mw-inline-row') || expDiv.previousElementSibling) : null;
        var mrDiv = document.getElementById('simulationResultManaRestored');
        var mrBlock = mrDiv ? (mrDiv.closest('.mw-inline-row') || mrDiv) : null;
        if (expBlock && mrBlock && expBlock.parentNode && mrBlock.parentNode) {
            expBlock.parentNode.insertBefore(mrBlock, expBlock.nextSibling);
        }
        // 2) 每小时使用的消耗品 → 总伤害（Damage Done Total 标题行）上面
        var dmgTitle = document.querySelector('#simulationResultColumn2 > .row');
        var cuDiv = document.getElementById('simulationResultConsumablesUsed');
        var cuBlock = cuDiv ? (cuDiv.closest('.mw-inline-row') || cuDiv.previousElementSibling) : null;
        if (dmgTitle && cuBlock && cuBlock.parentNode && dmgTitle.parentNode && cuBlock !== dmgTitle) {
            dmgTitle.parentNode.insertBefore(cuBlock, dmgTitle);
        }
    }

    inlineSimResultNumbers();
    reorderSimResultPanels();
    // 手机端：安装/更新两个按钮移到模拟器最底部（主容器末尾，战斗属性/模拟结果之后）
    function moveInstallButtonsToBottom() {
        if (!mq.matches) return;
        var live = document.getElementById('buttonInstallLiveImporter');
        var hit = document.getElementById('buttonInstallHitTrackerFix');
        if (!live || !hit || live.dataset.mwMoved) return;
        var container = document.querySelector('.container-fluid');
        if (!container) return;
        var wrap = document.createElement('div');
        wrap.className = 'row mt-3';
        wrap.style.justifyContent = 'center';
        var c1 = document.createElement('div');
        c1.className = 'col-md-auto';
        c1.style.margin = '2px';
        var c2 = document.createElement('div');
        c2.className = 'col-md-auto';
        c2.style.margin = '2px';
        c1.appendChild(live);
        c2.appendChild(hit);
        wrap.appendChild(c1);
        wrap.appendChild(c2);
        container.appendChild(wrap);
        live.dataset.mwMoved = '1';
    }
    moveInstallButtonsToBottom();
    if (mq.addEventListener) {
        mq.addEventListener('change', function () {
            splitLevelsIntoColumns();
            splitFoodDrinksIntoColumns();
            inlineSimResultNumbers();
            reorderSimResultPanels();
            moveInstallButtonsToBottom();
        });
    } else if (mq.addListener) {
        mq.addListener(function () {
            splitLevelsIntoColumns();
            splitFoodDrinksIntoColumns();
            inlineSimResultNumbers();
            reorderSimResultPanels();
            moveInstallButtonsToBottom();
        });
    }
})();


// R8-补：公会按钮/弹窗简体覆盖（兜底，独立于 locales）
function applyGuildSimplified() {
    var map = {
        "common:guildCombatBuffs.title": "公会",
        "common:guildCombatBuffs.description": "选择各公会神龛实际生效的战斗 Buff 等级；生活等级不纳入模拟。神龛升级后仍需购买对应的个人 Buff 等级才会生效。",
        "common:guildCombatBuffs.importSnapshotTitle": "目前基准来自这次汇入",
        "common:guildCombatBuffs.importSnapshotDescription": "插件会汇入目前角色的战斗神龛等级；缺少资料时会归零，不会沿用上一位角色。",
        "common:guildCombatBuffs.formulaNote": "原模拟器的攻击、命中、防御与技能公式保持不变；神龛效果透过相同的 Buff 属性管线加入。",
        "common:guildCombatBuffs.shrine": "神龛",
        "common:guildCombatBuffs.effect": "正式效果",
        "common:guildCombatBuffs.currentLevel": "目前等级",
        "common:guildCombatBuffs.testLevel": "测试等级",
        "common:guildCombatBuffs.resetImported": "神龛恢复汇入等级",
        "common:guildCombatBuffs.loadBlankPreset": "载入空白角色",
        "common:guildCombatBuffs.force": "力量神龛",
        "common:guildCombatBuffs.forceEffect": "每级：伤害 +0.3%",
        "common:guildCombatBuffs.tempo": "节奏神龛",
        "common:guildCombatBuffs.tempoEffect": "每级：攻击速度 +0.4%、施法速度 +0.4%",
        "common:guildCombatBuffs.spirit": "精神神龛",
        "common:guildCombatBuffs.spiritEffect": "每级：最大 HP +1%、最大 MP +1%",
        "common:guildCombatBuffs.rarity": "稀有神龛",
        "common:guildCombatBuffs.rarityEffect": "每级：战斗稀有发现 +1.5%",
        "common:guildCombatBuffs.scholar": "学者神龛",
        "common:guildCombatBuffs.scholarEffect": "每级：战斗经验 +0.5%"
    };
    function apply() {
        document.querySelectorAll('[data-i18n^="common:guildCombatBuffs"]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (map[key]) { el.textContent = map[key]; el.removeAttribute('data-i18n'); }
        });
        var btn = document.getElementById('buttonGuildCombatBuffsModal');
        if (btn) { btn.textContent = "公会"; btn.removeAttribute('data-i18n'); }
    }
    if (window.i18next && window.i18next.on) { try { window.i18next.on('initialized', apply); } catch (e) {} }
    if (document.readyState !== 'loading') { setTimeout(apply, 300); setTimeout(apply, 1500); setTimeout(apply, 4000); }
    else document.addEventListener('DOMContentLoaded', function () { setTimeout(apply, 300); setTimeout(apply, 1500); setTimeout(apply, 4000); });
}
applyGuildSimplified();
