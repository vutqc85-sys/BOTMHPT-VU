// Bot settings field definitions — rendered dynamically on the account page.
// Types: checkbox | num | text | select
const SETTING_GROUPS = [
  {
    name: 'Daily',
    fields: [
      { key: 'doAllAdsCheckbox', type: 'checkbox', label: 'Do All Ads' },
      { key: 'doManLocCotCheckbox', type: 'checkbox', label: 'Manual Local CoT' },
      { key: 'doManHeavenlyCotCheckbox', type: 'checkbox', label: 'Manual Heavenly CoT' },
      { key: 'doManCSCotCheckbox', type: 'checkbox', label: 'Manual CS CoT' },
      { key: 'doManStormCotCheckbox', type: 'checkbox', label: 'Manual Storm CoT' },
      { key: 'doManACSCotCheckbox', type: 'checkbox', label: 'Manual ACS CoT' },
      { key: 'doTreeCheckbox', type: 'checkbox', label: 'Do Tree' },
      { key: 'doTreeIds', type: 'text', label: 'Tree IDs (comma-separated)' },
      { key: 'doPchatCheckbox', type: 'checkbox', label: 'Do Pantheon Chat' },
      { key: 'pantheonWord', type: 'text', label: 'Pantheon Word' },
      { key: 'doChaosCheckbox', type: 'checkbox', label: 'Do Chaos' },
      { key: 'doWorshipCheckbox', type: 'checkbox', label: 'Do Worship' },
      { key: 'doWorshipId', type: 'num', label: 'Worship ID' },
      { key: 'doBeastCheckbox', type: 'checkbox', label: 'Do Beast' },
      { key: 'beastLevel', type: 'num', label: 'Beast Level' },
      { key: 'doHellCheckbox', type: 'checkbox', label: 'Do Hell' },
      { key: 'hellNumber', type: 'num', label: 'Hell Number' },
      { key: 'doSPCheckbox', type: 'checkbox', label: 'Do Spirit Pact' },
      { key: 'spNumber', type: 'num', label: 'SP Number' },
      { key: 'doSTCheckbox', type: 'checkbox', label: 'Do Spirit Troop' },
      { key: 'stNumber', type: 'num', label: 'ST Number' },
      { key: 'doVVCheckbox', type: 'checkbox', label: 'Do VV' },
      { key: 'vvNumber', type: 'num', label: 'VV Number' },
      { key: 'doInteractEventCheckbox', type: 'checkbox', label: 'Do Interact Event' },
      { key: 'doInteractEventNumber', type: 'num', label: 'Interact Event Number' },
      { key: 'doXtdCheckbox', type: 'checkbox', label: 'Do XTD' },
      { key: 'doAdventureCheckbox', type: 'checkbox', label: 'Do Adventure' },
      { key: 'doBuildWoodCheckbox', type: 'checkbox', label: 'Do Build Wood' },
      { key: 'readAndDelMailsCheckBox', type: 'checkbox', label: 'Read & Delete Mails' },
      { key: 'doFLCheckbox', type: 'checkbox', label: 'Do FL' },
      { key: 'doRobFLCheckbox', type: 'checkbox', label: 'Do Rob FL' },
      { key: 'doCompeteCheckbox', type: 'checkbox', label: 'Do Compete' },
      { key: 'doBreatheCheckbox', type: 'checkbox', label: 'Do Breathe' },
      { key: 'doVisitCheckbox', type: 'checkbox', label: 'Do Visit' },
      { key: 'doInteractCheckbox', type: 'checkbox', label: 'Do Interact' },
      { key: 'doAccompanyCheckbox', type: 'checkbox', label: 'Do Accompany' },
      { key: 'doBrewCheckbox', type: 'checkbox', label: 'Do Brew' },
      { key: 'doBUmapCheckbox', type: 'checkbox', label: 'Do BU Map' },
      { key: 'doRuinCheckbox', type: 'checkbox', label: 'Do Ruin' },
      { key: 'doMaxDemonSealCheckbox', type: 'checkbox', label: 'Do Max Demon Seal' },
      { key: 'usePCandITCheckbox', type: 'checkbox', label: 'Use PC & IT' },
      { key: 'doPantheonRewardCheckbox', type: 'checkbox', label: 'Do Pantheon Reward' }
    ]
  },
  {
    name: 'Market',
    fields: [
      { key: 'beastForageCheckbox', type: 'checkbox', label: 'Beast Forage' },
      { key: 'beastForageQuantity', type: 'num', label: 'Beast Forage Quantity' },
      { key: 'heavenIntPillCheckbox', type: 'checkbox', label: 'Heaven Int Pill' },
      { key: 'heavenIntPillQuantity', type: 'num', label: 'Heaven Int Pill Quantity' },
      { key: 'headenCrystalCheckbox', type: 'checkbox', label: 'Heaven Crystal' },
      { key: 'headenCrystalQuantity', type: 'num', label: 'Heaven Crystal Quantity' }
    ]
  },
  {
    name: 'Alliance',
    fields: [
      { key: 'buyLimitedAllianceShopCheckbox', type: 'checkbox', label: 'Buy Limited Alliance Shop' },
      { key: 'buyLimitedRuinShopCheckbox', type: 'checkbox', label: 'Buy Limited Ruin Shop' },
      { key: 'originEssenceCheckbox', type: 'checkbox', label: 'Origin Essence' },
      { key: 'originEssenceQuantity', type: 'num', label: 'Origin Essence Quantity' },
      { key: 'originSoulCheckbox', type: 'checkbox', label: 'Origin Soul' },
      { key: 'originSoulQuantity', type: 'num', label: 'Origin Soul Quantity' },
      { key: 'originPsicrystalCheckbox', type: 'checkbox', label: 'Origin Psicrystal' },
      { key: 'originPsicrystalQuantity', type: 'num', label: 'Origin Psicrystal Quantity' },
      { key: 'originGritCheckbox', type: 'checkbox', label: 'Origin Grit' },
      { key: 'originGritQuantity', type: 'num', label: 'Origin Grit Quantity' }
    ]
  },
  {
    name: 'Boutique / XT / Hell',
    fields: [
      { key: 'doBoutiqueCheckbox', type: 'checkbox', label: 'Do Boutique' },
      { key: 'useBoutiqueKeyCheckbox', type: 'checkbox', label: 'Use Boutique Key' },
      { key: 'doXTshopCheckbox', type: 'checkbox', label: 'Do XT Shop' },
      { key: 'hellBfCheckbox', type: 'checkbox', label: 'Hell BF' },
      { key: 'hellBfQuantity', type: 'num', label: 'Hell BF Quantity' },
      { key: 'hellHpCheckbox', type: 'checkbox', label: 'Hell HP' },
      { key: 'hellHpQuantity', type: 'num', label: 'Hell HP Quantity' },
      { key: 'hellHcCheckbox', type: 'checkbox', label: 'Hell HC' },
      { key: 'hellHcQuantity', type: 'num', label: 'Hell HC Quantity' }
    ]
  },
  {
    name: 'Compete',
    fields: [
      { key: 'buyCompeteP4H1Checkbox', type: 'checkbox', label: 'Buy Compete P4H1' },
      { key: 'buyCompeteTPP1Checkbox', type: 'checkbox', label: 'Buy Compete TPP1' },
      { key: 'buyCompeteP4H2Checkbox', type: 'checkbox', label: 'Buy Compete P4H2' },
      { key: 'buyCompeteTPP2Checkbox', type: 'checkbox', label: 'Buy Compete TPP2' }
    ]
  },
  {
    name: 'Conquest',
    fields: [
      { key: 'atkTroopsConquestValue', type: 'select', label: 'Attack Troops', options: ['100000', '1000000', '10000000', '100000000'] },
      { key: 'defTroopsConquestValue', type: 'select', label: 'Defense Troops', options: ['100000', '1000000', '10000000', '100000000'] }
    ]
  }
];
