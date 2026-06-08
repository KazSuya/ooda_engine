import { OgismData } from "./types";

export const DEMO_DATA: OgismData = {
  employeeName: "須山和弘",
  employeeId: "EMP-2026-44070",
  department: "MDX本部",
  period: "2026年1月1日～2026年6月30日",
  targetName:
    "Lifetime partnerへのシフトを可能にするAI agentソリューションの具現化",
  companyVision:
    "私たちは、世界中の全ての人々のために、快適と感動と喜びを与えるような、世界初・世界ネo.1の商品とserviceを提供しつづけます。そのために、全員で知恵を絞り、全員で助け合い、全員で達成感を味わう、共振の経営を推進します。",
  departmentVision:
    "第1049回～今週のUnique,Universal,United～【AI戦略提言 — Project-Renaissanceを加速する「Lifecycle Insight」の構築】にて発信され、社長直下に新設された「AI共創OODA推進プロジェクト」として、単なる業绩回復を超え、ユニ・チャームを「製造業：もの売り」から「Lifetime Partner：こと・体験・data」へと生まれ変わらせる＝Rebirthを実現する。",
  objectives:
    "【目標】第1049回～今週のUnique,Universal,United～にて発信された「社長直下に「AI共創OODA推進室」を新設する」を受け、全社横断となる本組織がAI共創の業務フローを構築し、UCがLifetime partnerへのシフトを可能にするためのAI agentソリューションを具現化することで全社変革を実現する。\n\n【詳細目標】\n①Data戦略の司令塔: 全社Data GovernanceとCDPの管理・運用\n②OODAEngine: 各部門がAIを活用しOODA-Loopを実践するためのTool提供と伴走支援\n③知見のHub: AI活用による成功事例や学びを形式知化し、全社に還流させる「共振の経営」のPlatformの開発\n④人材育成: 全社員のAI literacy向上とAIを協働パートナーとできる人材の育成\n⑤「AI共創OODAsolution（UCOS）」の競合優位性を担保するための新たな価値創造",
  goalSets: [
    {
      id: 1,
      title:
        "目標セット1：全社横断AI戦略推進部門による U...",
      objective:
        "①Data戦略の司令塔: 全社Data GovernanceとCDPの管理・運用",
      goals:
        "・ソリューションが4つの機能を実装している状態\n・WAU 1,000以上\n・新規事業1件ロンチ",
      issues:
        "課題①\n①-1: Governance統制された社内DataとCDP\n①-2: 新しいOODA-Loopの実践のために必要なAI Tool\n①-3: 社内に散らばっているAI活用成功事例の集約・蓄積\n①-4: AI協働業務flow",
      strategies:
        "戦略①【AI共創OODA推進】\n①-1: Data戦略の司令塔として「AI共創OODA推進室」にてCDPを構築・運用\n①-2: AI Toolを「CDP」と「AI agent」と「AI agentを活用可能なUI」を持ったsolutionと定義し開発・運用\n①-3: メンバーによる部門横断でのトライアンドエラーの集約・蓄積\n①-4: AI agentとの協働・共創の業務フローを設計・構築・実装",
      measures:
        "・開発進捗\n・AIによる削減時間価値\n・AIによる事業創造価値\n・社内導入率\n・MAU/WAU/DAU",
    },
    {
      id: 2,
      title:
        "目標セット2：UCOSプロトタイプを活用した新...",
      objective:
        "②UCOSプロトタイプ（客相インサイト発掘solution）を活用し既存のSBUではGOジャッジのできない飛び地の事業の創出",
      goals:
        "・新規事業テーマ3件以上の発掘\n・うち1件の事業化GOジャッジ",
      issues:
        "課題②\n生み出した競合優位性を他社に真似されずに維持するための既存部門からは生まれない、新たな価値による事業return",
      strategies:
        "戦略②【AI共剱OODA推進】\n1. 既存商品から体験を分断しない\n2. 具体的なsolutionの提示まではしない\n3. 法規制のグレーゾーンに入らない\n4. 海外でも成立する\n5. UCOSの学習データが溜まる",
      measures:
        "・新規事業件数\n・事業創造価値（推計）",
    },
    {
      id: 3,
      title:
        "目標セット3：客相インサイト発掘solutio...",
      objective:
        "③客相インサイト発掘solutionの機能拡張",
      goals:
        "・SNSデータ格納完了\n・コラボレーション機能リリース\n・WAU 500以上",
      issues:
        "課題③\n③-1: データソースの拡張（個人情報ガバナンス整理）\n③-2: SNSデータの格納\n③-3: コラボレーション機能などsolution自体の使い勝手向上",
      strategies:
        "戦略③【客相データ活用】\n③-1: クローズド環境における個人情報のAI学習を可能とするガバナンスを整理\n③-2: SNSデータを格納\n③-3: コラボレーション機能などsolution自体の機能を進化",
      measures:
        "・機能実装数\n・ユーザー満足度スコア",
    },
    {
      id: 4,
      title:
        "目標セット4：客相アドバイザー応対のAI ag...",
      objective:
        "④客相アドバイザーのAI agent化",
      goals:
        "・FAQの拡張完了\n・チャームさんへの実装\n・応対自動化率 30%以上",
      issues:
        "課題④\n属人化しているアドバイザーの応対AI agent化しノウハウの蓄積、他PFへの横展開",
      strategies:
        "戦略④【客相データ活用】\n④-1: アドバイザーAI agentを開発。最初のステップとしてFAQの拡張を実施\n④-2: 拡張したFAQをチャームさんへ実装",
      measures:
        "・FAQ拡張件数\n・自動応対率\n・顧客満足度",
    },
    {
      id: 5,
      title: "目標セット5：目標セット5",
      objective:
        "⑤「AI共剱OODAsolution（UCOS）」の競合優位性を担保するための新たな価値創造",
      goals:
        "・競合優位性レポート作成\n・新規価値提案 1件以上",
      issues:
        "課題⑥\n競合他社のAI戦略に対する自社優位性の継続的確保",
      strategies:
        "戦略⑥\nUCOSをUnicharm OSと定義し、客相インサイト発掘solutionをUCOSとして進化させ、その先行事例を客相データの活用によって生み出す",
      measures:
        "・競合分析レポート更新頻度\n・新規価値創出件数",
    },
  ],
  currentAnalysis:
    "生成AIの進化のSpeedは著しく、企業のAI適応力・順応力は高まってくる。現在UCでは各部門最適なデータ活用、AI活用が進んでいるが、AIの質はインプットされるデータの質と量が全てであるため、よりAIのパフォーマンスを高める為には、全社横断のデータを活用した、全社横断のAI agentを開発し、全社横断でこのAI agentを使いこなし、商品/サービスを開発し改善し続ける必要がある。",
  environmentForecast:
    "今後は商品や戦略だけでなく、企業の哲学すら同質化してくると予想され、UCはAI順応によって「何を競合優位性とするか」の定義が重要になってくる。\n1・良い商品を作ってもすぐに真似される。\n2・良い戦略もすぐに真似される。\n3・企業の哲学ですらコモディティ化してくる。\n\nこの時に競合優位性となるのは「AI活用を前提とした企業運用OS」の存在であり、このOSのクオリティの差が商品・事業価値を左右すると予測される。",
  riskChance:
    "＜期間内に発生する可能性の高いRisk＞\n良い商品を出しても先行利益を享受できる期間は今以上に短くなり、常に価格競争に降るリスクがある。\n\n＜期間内に実現する可能性の高いChance＞\nUCが持つ最大の競合優位性は共生社会の実現を2020年の「Kyo-sei Life Vision 2030」において表明している点であり、実際の企業 capabilityとして「人の膚に触れる領域」を誠実に商品化してきている強みがあり、この競合優位性と強みはAI活用時代において我が社のChanceとなる。",
};
