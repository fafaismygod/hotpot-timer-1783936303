(function () {
  window.FOOD_ICONS = {
    __default: '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M10 24 L38 24 Q38 36 24 36 Q10 36 10 24Z" fill="#f0e8d8" stroke="#a89878" stroke-width="2"/><ellipse cx="24" cy="24" rx="14" ry="3" fill="#e8d8b8" stroke="#a89878" stroke-width="2"/><path d="M18 20 Q22 16 24 18" fill="none" stroke="#c88858" stroke-width="1.5" stroke-linecap="round"/><path d="M26 18 Q28 16 30 20" fill="none" stroke="#c88858" stroke-width="1.5" stroke-linecap="round"/></svg>',

    '毛肚': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="26" rx="16" ry="11" fill="#f5f0e8" stroke="#a89a8c" stroke-width="2"/><circle cx="18" cy="22" r="1.5" fill="#a89a8c"/><circle cx="24" cy="20" r="1.5" fill="#a89a8c"/><circle cx="30" cy="22" r="1.5" fill="#a89a8c"/><circle cx="20" cy="28" r="1.5" fill="#a89a8c"/><circle cx="28" cy="29" r="1.5" fill="#a89a8c"/><circle cx="24" cy="32" r="1.5" fill="#a89a8c"/></svg>',

    '鸭肠': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M10 18 Q16 10 24 14 Q34 18 38 12" fill="none" stroke="#f4a6b8" stroke-width="5" stroke-linecap="round"/><path d="M10 28 Q16 20 24 24 Q34 28 38 22" fill="none" stroke="#f4a6b8" stroke-width="5" stroke-linecap="round"/><path d="M10 38 Q16 30 24 34 Q34 38 38 32" fill="none" stroke="#f4a6b8" stroke-width="5" stroke-linecap="round"/></svg>',

    '牛百叶': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="14" width="32" height="20" rx="2" fill="#e8e4dc" stroke="#9a9388" stroke-width="2"/><line x1="10" y1="19" x2="38" y2="19" stroke="#9a9388" stroke-width="1.2"/><line x1="10" y1="24" x2="38" y2="24" stroke="#9a9388" stroke-width="1.2"/><line x1="10" y1="29" x2="38" y2="29" stroke="#9a9388" stroke-width="1.2"/></svg>',

    '黄喉': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M12 16 Q24 12 36 16 Q38 24 36 32 Q24 36 12 32 Q10 24 12 16Z" fill="#f5ecd0" stroke="#d4b888" stroke-width="2"/><path d="M15 19 Q24 17 33 19" fill="none" stroke="#d4b888" stroke-width="1.2"/><path d="M15 24 Q24 22 33 24" fill="none" stroke="#d4b888" stroke-width="1.2"/><path d="M15 29 Q24 27 33 29" fill="none" stroke="#d4b888" stroke-width="1.2"/></svg>',

    '肥牛卷': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="14" fill="none" stroke="#e8826a" stroke-width="3"/><circle cx="24" cy="24" r="9" fill="none" stroke="#e8826a" stroke-width="3"/><circle cx="24" cy="24" r="4" fill="#f5a088"/></svg>',

    '嫩牛肉': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M8 22 Q12 14 24 14 Q36 14 40 22 Q40 32 32 34 Q24 36 16 34 Q8 32 8 22Z" fill="#c0392b" stroke="#962d22" stroke-width="2"/><path d="M14 22 Q20 20 26 22" fill="none" stroke="#962d22" stroke-width="1.5" stroke-linecap="round"/><path d="M18 28 Q24 26 30 28" fill="none" stroke="#962d22" stroke-width="1.5" stroke-linecap="round"/></svg>',

    '鸭血': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="14" width="28" height="22" rx="3" fill="#8b2c2c" stroke="#6b1f1f" stroke-width="2"/><rect x="14" y="18" width="6" height="6" fill="#a03838" opacity="0.6"/><rect x="28" y="26" width="6" height="6" fill="#a03838" opacity="0.6"/></svg>',

    '午餐肉': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="14" width="28" height="22" rx="3" fill="#e89a8c" stroke="#c87868" stroke-width="2"/><line x1="17" y1="14" x2="17" y2="36" stroke="#c87868" stroke-width="1"/><line x1="24" y1="14" x2="24" y2="36" stroke="#c87868" stroke-width="1"/><line x1="31" y1="14" x2="31" y2="36" stroke="#c87868" stroke-width="1"/><line x1="10" y1="22" x2="38" y2="22" stroke="#c87868" stroke-width="1"/><line x1="10" y1="29" x2="38" y2="29" stroke="#c87868" stroke-width="1"/></svg>',

    '脑花': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="24" rx="15" ry="12" fill="#f0c8c0" stroke="#c89888" stroke-width="2"/><path d="M16 20 Q20 16 24 20 Q28 16 32 20" fill="none" stroke="#c89888" stroke-width="1.8"/><path d="M14 26 Q18 22 22 26 Q26 22 30 26 Q34 22 34 26" fill="none" stroke="#c89888" stroke-width="1.8"/><path d="M16 32 Q20 28 24 32 Q28 28 32 32" fill="none" stroke="#c89888" stroke-width="1.8"/></svg>',

    '鲜虾': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M12 32 Q14 20 24 14 Q34 14 36 22 Q34 30 28 32 Q20 34 12 32Z" fill="#f0887a" stroke="#c86058" stroke-width="2"/><circle cx="30" cy="20" r="1.5" fill="#333"/><path d="M36 22 L42 18 M36 24 L43 24 M35 26 L42 30" stroke="#c86058" stroke-width="1.5" stroke-linecap="round"/><path d="M12 32 Q10 36 14 38" fill="none" stroke="#c86058" stroke-width="1.8" stroke-linecap="round"/></svg>',

    '蟹棒': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="10" width="20" height="28" rx="4" fill="#fff" stroke="#e88068" stroke-width="2"/><rect x="14" y="16" width="20" height="3" fill="#f08868"/><rect x="14" y="24" width="20" height="3" fill="#f08868"/><rect x="14" y="32" width="20" height="3" fill="#f08868"/></svg>',

    '贝类': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M8 34 Q8 14 24 12 Q40 14 40 34 Z" fill="#f0d8b0" stroke="#b89868" stroke-width="2"/><line x1="24" y1="14" x2="14" y2="32" stroke="#b89868" stroke-width="1.2"/><line x1="24" y1="14" x2="20" y2="32" stroke="#b89868" stroke-width="1.2"/><line x1="24" y1="14" x2="28" y2="32" stroke="#b89868" stroke-width="1.2"/><line x1="24" y1="14" x2="34" y2="32" stroke="#b89868" stroke-width="1.2"/><circle cx="24" cy="14" r="2" fill="#b89868"/></svg>',

    '鱿鱼': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="18" rx="9" ry="10" fill="#f0e8e0" stroke="#a89890" stroke-width="2"/><path d="M16 26 Q14 38 12 42 M20 28 Q20 40 20 42 M24 28 Q24 40 24 42 M28 28 Q28 40 28 42 M32 26 Q34 38 36 42" fill="none" stroke="#a89890" stroke-width="1.8" stroke-linecap="round"/><circle cx="21" cy="18" r="1.5" fill="#333"/><circle cx="27" cy="18" r="1.5" fill="#333"/></svg>',

    '鱼片': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M8 24 Q14 16 24 16 Q34 16 40 24 Q34 32 24 32 Q14 32 8 24Z" fill="#f0d8c0" stroke="#c89878" stroke-width="2"/><line x1="16" y1="22" x2="32" y2="22" stroke="#c89878" stroke-width="1.2"/><line x1="18" y1="26" x2="30" y2="26" stroke="#c89878" stroke-width="1.2"/><circle cx="34" cy="22" r="1" fill="#c89878"/></svg>',

    '牛肉丸': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="14" fill="#a86838" stroke="#804820" stroke-width="2"/><circle cx="20" cy="20" r="2" fill="#804820" opacity="0.5"/><circle cx="28" cy="22" r="1.5" fill="#804820" opacity="0.5"/><circle cx="22" cy="28" r="1.8" fill="#804820" opacity="0.5"/><circle cx="30" cy="28" r="1.5" fill="#804820" opacity="0.5"/></svg>',

    '鱼丸': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="14" fill="#fafaf0" stroke="#c8c0a8" stroke-width="2"/><circle cx="20" cy="20" r="1.5" fill="#e8c868" opacity="0.6"/><circle cx="28" cy="24" r="1.2" fill="#e8c868" opacity="0.6"/><circle cx="24" cy="30" r="1.5" fill="#e8c868" opacity="0.6"/></svg>',

    '虾滑': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M10 36 L24 24 Q30 20 36 22 Q38 26 34 30 Q28 34 22 32 L10 36Z" fill="#e8e8e8" stroke="#a8a8a8" stroke-width="2"/><ellipse cx="30" cy="25" rx="7" ry="5" fill="#f6a8a0" stroke="#c87870" stroke-width="1.5" transform="rotate(-18 30 25)"/><circle cx="28" cy="23" r="1" fill="#c87870" opacity="0.5"/><circle cx="32" cy="25" r="1" fill="#c87870" opacity="0.5"/><circle cx="30" cy="27" r="1" fill="#c87870" opacity="0.5"/></svg>',

    '蟹籽包': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="13" fill="#f08838" stroke="#c86020" stroke-width="2"/><circle cx="19" cy="20" r="1" fill="#fff"/><circle cx="24" cy="18" r="1" fill="#fff"/><circle cx="29" cy="21" r="1" fill="#fff"/><circle cx="21" cy="25" r="1" fill="#fff"/><circle cx="27" cy="25" r="1" fill="#fff"/><circle cx="19" cy="29" r="1" fill="#fff"/><circle cx="24" cy="31" r="1" fill="#fff"/><circle cx="29" cy="29" r="1" fill="#fff"/></svg>',

    '土豆片': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="24" rx="16" ry="12" fill="#f0d878" stroke="#c8a838" stroke-width="2"/><ellipse cx="24" cy="24" rx="16" ry="12" fill="none" stroke="#e0c050" stroke-width="1"/></svg>',

    '藕片': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="15" fill="#f8f4ec" stroke="#b8a888" stroke-width="2"/><circle cx="18" cy="20" r="2" fill="#b8a888"/><circle cx="28" cy="18" r="2" fill="#b8a888"/><circle cx="30" cy="27" r="2" fill="#b8a888"/><circle cx="18" cy="28" r="2" fill="#b8a888"/><circle cx="24" cy="24" r="2" fill="#b8a888"/></svg>',

    '冬瓜': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="14" width="32" height="22" rx="3" fill="#c8e0a8" stroke="#88a868" stroke-width="2"/><rect x="12" y="18" width="4" height="4" fill="#88a868" opacity="0.5"/><rect x="32" y="28" width="4" height="4" fill="#88a868" opacity="0.5"/></svg>',

    '白菜': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M24 10 Q14 18 14 28 Q14 36 24 38 Q34 36 34 28 Q34 18 24 10Z" fill="#a8d088" stroke="#689048" stroke-width="2"/><path d="M24 14 L24 36" stroke="#689048" stroke-width="1.2"/><path d="M20 18 Q24 22 24 28" fill="none" stroke="#689048" stroke-width="1"/><path d="M28 18 Q24 22 24 28" fill="none" stroke="#689048" stroke-width="1"/></svg>',

    '生菜': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M12 30 Q10 18 18 14 Q24 10 30 14 Q38 18 36 30 Q34 36 24 36 Q14 36 12 30Z" fill="#90c870" stroke="#588840" stroke-width="2"/><path d="M16 22 Q20 18 24 22 Q28 18 32 22" fill="none" stroke="#588840" stroke-width="1.2"/><path d="M18 28 Q22 24 24 28 Q26 24 30 28" fill="none" stroke="#588840" stroke-width="1.2"/></svg>',

    '茼蒿': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M24 10 L22 28 M24 10 L26 28 M24 10 L20 24 M24 10 L28 24 M24 10 L18 30 M24 10 L30 30" stroke="#88b060" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M20 32 Q24 38 28 32" fill="none" stroke="#88b060" stroke-width="2" stroke-linecap="round"/></svg>',

    '海带': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M8 18 Q14 12 20 18 Q26 24 32 18 Q38 12 40 18 L40 28 Q34 34 28 28 Q22 22 16 28 Q10 34 8 28 Z" fill="#4a8050" stroke="#306040" stroke-width="2"/></svg>',

    '金针菇': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="18" rx="4" ry="3" fill="#f0e8d0" stroke="#a89868" stroke-width="1.5"/><ellipse cx="24" cy="16" rx="4" ry="3" fill="#f0e8d0" stroke="#a89868" stroke-width="1.5"/><ellipse cx="32" cy="18" rx="4" ry="3" fill="#f0e8d0" stroke="#a89868" stroke-width="1.5"/><line x1="16" y1="20" x2="15" y2="36" stroke="#f0e8d0" stroke-width="2.5" stroke-linecap="round"/><line x1="24" y1="18" x2="24" y2="36" stroke="#f0e8d0" stroke-width="2.5" stroke-linecap="round"/><line x1="32" y1="20" x2="33" y2="36" stroke="#f0e8d0" stroke-width="2.5" stroke-linecap="round"/></svg>',

    '香菇': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M10 22 Q10 12 24 12 Q38 12 38 22 Z" fill="#8a6038" stroke="#5a3818" stroke-width="2"/><rect x="20" y="22" width="8" height="14" rx="2" fill="#f0d8b0" stroke="#a88858" stroke-width="1.5"/><circle cx="18" cy="18" r="1.5" fill="#5a3818" opacity="0.6"/><circle cx="28" cy="16" r="1.5" fill="#5a3818" opacity="0.6"/><circle cx="32" cy="20" r="1.2" fill="#5a3818" opacity="0.6"/></svg>',

    '杏鲍菇': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="16" rx="10" ry="6" fill="#f0e8d8" stroke="#a89878" stroke-width="2"/><rect x="18" y="18" width="12" height="20" rx="3" fill="#f0e8d8" stroke="#a89878" stroke-width="2"/><ellipse cx="24" cy="16" rx="6" ry="3" fill="#e0d8c0" opacity="0.6"/></svg>',

    '平菇': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M10 28 Q10 14 24 12 Q36 14 38 26 Q34 30 28 28 Q22 30 16 28 Q12 30 10 28Z" fill="#b8b0a0" stroke="#787068" stroke-width="2"/><line x1="14" y1="24" x2="20" y2="20" stroke="#787068" stroke-width="1" opacity="0.6"/><line x1="20" y1="22" x2="26" y2="18" stroke="#787068" stroke-width="1" opacity="0.6"/><line x1="26" y1="22" x2="32" y2="20" stroke="#787068" stroke-width="1" opacity="0.6"/><rect x="20" y="28" width="8" height="10" rx="2" fill="#f0e8d8" stroke="#a89878" stroke-width="1.5"/></svg>',

    '豆腐': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="14" width="28" height="22" rx="3" fill="#fafaf0" stroke="#c8c0a0" stroke-width="2"/><line x1="10" y1="22" x2="38" y2="22" stroke="#c8c0a0" stroke-width="1" opacity="0.6"/><line x1="10" y1="28" x2="38" y2="28" stroke="#c8c0a0" stroke-width="1" opacity="0.6"/></svg>',

    '冻豆腐': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="14" width="28" height="22" rx="3" fill="#fafaf0" stroke="#c8c0a0" stroke-width="2"/><circle cx="16" cy="20" r="2" fill="#c8c0a0" opacity="0.6"/><circle cx="26" cy="18" r="2" fill="#c8c0a0" opacity="0.6"/><circle cx="32" cy="24" r="2" fill="#c8c0a0" opacity="0.6"/><circle cx="18" cy="28" r="2" fill="#c8c0a0" opacity="0.6"/><circle cx="28" cy="30" r="2" fill="#c8c0a0" opacity="0.6"/></svg>',

    '豆皮': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="16" width="28" height="18" rx="2" fill="#f0d870" stroke="#b89838" stroke-width="2"/><line x1="14" y1="22" x2="34" y2="22" stroke="#b89838" stroke-width="1" opacity="0.6"/><line x1="14" y1="28" x2="34" y2="28" stroke="#b89838" stroke-width="1" opacity="0.6"/></svg>',

    '腐竹': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="20" width="28" height="8" rx="4" fill="#e8c850" stroke="#a88820" stroke-width="2" transform="rotate(-8 24 24)"/><rect x="12" y="30" width="20" height="6" rx="3" fill="#e8c850" stroke="#a88820" stroke-width="2" transform="rotate(6 24 33)"/></svg>',

    '千张': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="14" width="28" height="22" rx="2" fill="#f0d870" stroke="#b89838" stroke-width="2"/><line x1="10" y1="20" x2="38" y2="20" stroke="#b89838" stroke-width="0.8" opacity="0.5"/><line x1="10" y1="26" x2="38" y2="26" stroke="#b89838" stroke-width="0.8" opacity="0.5"/><line x1="10" y1="32" x2="38" y2="32" stroke="#b89838" stroke-width="0.8" opacity="0.5"/></svg>',

    '宽粉': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M8 18 Q14 16 20 20 Q26 24 32 20 Q38 16 40 20" fill="none" stroke="#f8f4ec" stroke-width="8" stroke-linecap="round"/><path d="M8 18 Q14 16 20 20 Q26 24 32 20 Q38 16 40 20" fill="none" stroke="#c8c0a8" stroke-width="8" stroke-linecap="round" opacity="0.3"/><path d="M8 30 Q14 28 20 32 Q26 36 32 32 Q38 28 40 32" fill="none" stroke="#f8f4ec" stroke-width="8" stroke-linecap="round"/></svg>',

    '红薯粉': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="14" x2="36" y2="16" stroke="#b8a888" stroke-width="2.5" stroke-linecap="round"/><line x1="10" y1="20" x2="38" y2="22" stroke="#b8a888" stroke-width="2.5" stroke-linecap="round"/><line x1="12" y1="26" x2="36" y2="28" stroke="#b8a888" stroke-width="2.5" stroke-linecap="round"/><line x1="10" y1="32" x2="38" y2="34" stroke="#b8a888" stroke-width="2.5" stroke-linecap="round"/></svg>',

    '方便面': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="14" fill="#f0c850" stroke="#a88820" stroke-width="2"/><path d="M14 22 Q18 18 22 22 Q26 26 30 22 Q34 18 34 24" fill="none" stroke="#a88820" stroke-width="1.5"/><path d="M14 28 Q18 24 22 28 Q26 32 30 28 Q34 24 34 30" fill="none" stroke="#a88820" stroke-width="1.5"/></svg>',

    '饺子': '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M10 28 Q14 16 24 14 Q34 16 38 28 Q34 32 24 32 Q14 32 10 28Z" fill="#fafaf0" stroke="#c8b888" stroke-width="2"/><path d="M14 24 Q18 22 22 24 M22 24 Q26 22 30 24 M30 24 Q34 22 36 24" fill="none" stroke="#c8b888" stroke-width="1.2"/><line x1="14" y1="22" x2="36" y2="22" stroke="#c8b888" stroke-width="1" opacity="0.5"/></svg>'
  };

  window.getFoodIcon = function (name, isCustom) {
    if (isCustom) return window.FOOD_ICONS.__default;
    return window.FOOD_ICONS[name] || window.FOOD_ICONS.__default;
  };
})();
