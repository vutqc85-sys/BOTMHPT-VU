// Bot settings field definitions — rendered dynamically on the account page.
// Types: checkbox | num | text | select
const SETTING_GROUPS = [
  {
    name: 'Daily Tasks',
    fields: [
      { key: 'doAllAdsCheckbox', type: 'checkbox', label: 'Run ads' },
      { key: 'doManLocCotCheckbox', type: 'checkbox', label: 'Manual Local CoT' },
      { key: 'doManHeavenlyCotCheckbox', type: 'checkbox', label: 'Manual Heavenly CoT' },
      { key: 'doManCSCotCheckbox', type: 'checkbox', label: 'Manual CS CoT' },
      { key: 'doManStormCotCheckbox', type: 'checkbox', label: 'Manual Storm CoT' },
      { key: 'doManACSCotCheckbox', type: 'checkbox', label: 'Manual ACS CoT' },
      { key: 'doTreeCheckbox', type: 'checkbox', label: 'Take care of friend trees' },
      { key: 'doPchatCheckbox', type: 'checkbox', label: 'Pantheon chat' },
      { key: 'doChaosCheckbox', type: 'checkbox', label: 'Do Chaos' },
      { key: 'doInteractEventCheckbox', type: 'checkbox', label: 'Interact for event rebate' },
      { key: 'doWorshipCheckbox', type: 'checkbox', label: 'Worship' },
      { key: 'doBeastCheckbox', type: 'checkbox', label: 'Beast seal' },
      { key: 'doHellCheckbox', type: 'checkbox', label: 'Hell' },
      { key: 'doSPCheckbox', type: 'checkbox', label: 'Spirit pact' },
      { key: 'doSTCheckbox', type: 'checkbox', label: 'Spirit troop' },
      { key: 'doVVCheckbox', type: 'checkbox', label: 'VV' },
      { key: 'doXtdCheckbox', type: 'checkbox', label: 'Do Vanguard Generals task (14h-16h)' },
      { key: 'doAdventureCheckbox', type: 'checkbox', label: 'Run adventure level 20 (60 times)' },
      { key: 'doBuildWoodCheckbox', type: 'checkbox', label: 'BuildWood' },
      { key: 'readAndDelMailsCheckBox', type: 'checkbox', label: 'Read/Del mails' },
      { key: 'doFLCheckbox', type: 'checkbox', label: 'FL (no boost)' },
      { key: 'doRobFLCheckbox', type: 'checkbox', label: 'Rob FL (only rob IA)' },
      { key: 'doCompeteCheckbox', type: 'checkbox', label: 'Compete' },
      { key: 'doBreatheCheckbox', type: 'checkbox', label: 'Breathe' },
      { key: 'doVisitCheckbox', type: 'checkbox', label: 'Visit' },
      { key: 'doInteractCheckbox', type: 'checkbox', label: 'Interact' },
      { key: 'doAccompanyCheckbox', type: 'checkbox', label: 'Free accompany' },
      { key: 'doBrewCheckbox', type: 'checkbox', label: 'buy/brew once for sermon' },
      { key: 'doBUmapCheckbox', type: 'checkbox', label: 'buy/use map once for sermon' },
      { key: 'doRuinCheckbox', type: 'checkbox', label: 'Do Ruin' },
      { key: 'doMaxDemonSealCheckbox', type: 'checkbox', label: 'Do Demon Tower' },
      { key: 'usePCandITCheckbox', type: 'checkbox', label: 'Use Primordial chest and Inspector token' },
      { key: 'doPantheonRewardCheckbox', type: 'checkbox', label: 'Get Pantheon activity rewards' },
      { key: 'doTreeIds', type: 'text', label: 'Friend(s) id(s)', placeholder: 'id1,id2' },
      { key: 'pantheonWord', type: 'text', label: 'What you want to write in chat' },
      { key: 'doInteractEventNumber', type: 'num', label: 'Number of pills to use' },
      { key: 'doWorshipId', type: 'num', label: 'Worship id' },
      { key: 'beastLevel', type: 'num', label: 'Beast seal level' },
      { key: 'hellNumber', type: 'num', label: 'Hell number of attempts' },
      { key: 'spNumber', type: 'num', label: 'Spirit pact Number' },
      { key: 'stNumber', type: 'num', label: 'Spirit troop Number' },
      { key: 'vvNumber', type: 'num', label: 'VV stage (example 124)' }
    ]
  },
  {
    name: 'Market Beast Resources',
    fields: [
      { key: 'beastForageCheckbox', type: 'checkbox', label: 'Beast Forage' },
      { key: 'beastForageQuantity', type: 'num', label: 'Quantity (price 500/u)' },
      { key: 'heavenIntPillCheckbox', type: 'checkbox', label: 'Heaven int. pill' },
      { key: 'heavenIntPillQuantity', type: 'num', label: 'Quantity (price 300/u)' },
      { key: 'headenCrystalCheckbox', type: 'checkbox', label: 'Heaven Crystal' },
      { key: 'headenCrystalQuantity', type: 'num', label: 'Quantity (price 1500/u)' }
    ]
  },
  {
    name: 'Boutique Shop',
    fields: [
      { key: 'doBoutiqueCheckbox', type: 'checkbox', label: 'Buy springs in boutique' },
      { key: 'useBoutiqueKeyCheckbox', type: 'checkbox', label: 'Use boutique keys' }
    ]
  },
  {
    name: 'XT Shop',
    fields: [
      { key: 'doXTshopCheckbox', type: 'checkbox', label: 'Buy XT shop' }
    ]
  },
  {
    name: 'Hell Shop',
    fields: [
      { key: 'hellBfCheckbox', type: 'checkbox', label: 'Beast Forage' },
      { key: 'hellBfQuantity', type: 'num', label: 'Quantity' },
      { key: 'hellHpCheckbox', type: 'checkbox', label: 'Heaven int. pill' },
      { key: 'hellHpQuantity', type: 'num', label: 'Quantity' },
      { key: 'hellHcCheckbox', type: 'checkbox', label: 'Heaven Crystal' },
      { key: 'hellHcQuantity', type: 'num', label: 'Quantity' }
    ]
  },
  {
    name: 'Ruin Shop',
    fields: [
      { key: 'buyLimitedRuinShopCheckbox', type: 'checkbox', label: 'Buy all max limited Ruin shop' }
    ]
  },
  {
    name: 'Alliance Shop',
    fields: [
      { key: 'buyLimitedAllianceShopCheckbox', type: 'checkbox', label: 'Buy all max limited alliance shop (except Bodhi only x2)' },
      { key: 'originEssenceCheckbox', type: 'checkbox', label: 'Origin essence' },
      { key: 'originEssenceQuantity', type: 'num', label: 'Quantity' },
      { key: 'originSoulCheckbox', type: 'checkbox', label: 'Origin soul' },
      { key: 'originSoulQuantity', type: 'num', label: 'Quantity' },
      { key: 'originPsicrystalCheckbox', type: 'checkbox', label: 'Origin psicrystal' },
      { key: 'originPsicrystalQuantity', type: 'num', label: 'Quantity' },
      { key: 'originGritCheckbox', type: 'checkbox', label: 'Origin grit' },
      { key: 'originGritQuantity', type: 'num', label: 'Quantity' }
    ]
  },
  {
    name: 'Compete Shop',
    fields: [
      { key: 'buyCompeteP4H1Checkbox', type: 'checkbox', label: 'Pill of Four Heavens (200x2)' },
      { key: 'buyCompeteTPP1Checkbox', type: 'checkbox', label: 'Talent Pill Piece (160x2)' },
      { key: 'buyCompeteP4H2Checkbox', type: 'checkbox', label: 'Pill of Four Heavens (250x3)' },
      { key: 'buyCompeteTPP2Checkbox', type: 'checkbox', label: 'Talent Pill Piece (200x3)' }
    ]
  },
  {
    name: 'Conquest Troops',
    fields: [
      { key: 'atkTroopsConquestValue', type: 'select', label: 'Attack troops', options: ['100000', '1000000', '10000000', '100000000'] },
      { key: 'defTroopsConquestValue', type: 'select', label: 'Def troops', options: ['100000', '1000000', '10000000', '100000000'] }
    ]
  }
];
