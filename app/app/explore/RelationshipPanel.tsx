'use client';

import {
  AdviceActionId,
  WorkplaceAdviceResponse,
  WorkplacePerson,
} from '../../src/types/workplace';
import { workplaceActions, workplacePresets } from '../../src/data/workplace-presets';

interface RelationshipPanelProps {
  selfMbti: string;
  person: WorkplacePerson | null;
  selectedActionId: AdviceActionId;
  concern: string;
  advice: WorkplaceAdviceResponse | null;
  isGenerating: boolean;
  error: string | null;
  onPresetChange: (presetId: string) => void;
  onNotesChange: (notes: string) => void;
  onClosenessChange: (value: number) => void;
  onStressChange: (value: number) => void;
  onActionChange: (actionId: AdviceActionId) => void;
  onConcernChange: (value: string) => void;
  onGenerateAdvice: () => void;
}

const confidenceLabels = {
  low: '低',
  medium: '中',
  high: '高',
};

function SectionList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[16px] border border-[#EEE7DE] bg-white/86 p-4">
      <h3 className="mb-3 text-[12px] font-extrabold text-[#6D4DE8]">{title}</h3>
      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-2.5 text-[13px] font-bold leading-relaxed text-[#332B45]">
            <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#9B8CF1]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AdviceResult({ advice }: { advice: WorkplaceAdviceResponse }) {
  return (
    <section className="rounded-[18px] border border-[#B99BFF] bg-[#F6F2FF] p-4">
      <p className="text-[12px] font-extrabold text-[#6D4DE8]">SIMULATION RESULT</p>
      <h3 className="mt-2 text-[20px] font-extrabold leading-tight text-[#221B31]">{advice.title}</h3>
      <p className="mt-3 text-[13px] font-bold leading-relaxed text-[#4D435D]">{advice.summary}</p>

      <div className="mt-4 grid gap-3">
        <SectionList title="方針" items={advice.strategy} />
        <SectionList title="避けたい言い方" items={advice.avoid} />
        <section className="rounded-[16px] border border-[#E4D8F6] bg-white p-4">
          <h4 className="mb-2 text-[12px] font-extrabold text-[#6D4DE8]">文面ドラフト</h4>
          <p className="whitespace-pre-wrap text-[13px] font-bold leading-relaxed text-[#332B45]">
            {advice.messageDraft}
          </p>
        </section>
        <SectionList title="会話の切り出し" items={advice.talkingPoints} />
        <section className="rounded-[16px] border border-[#E4D8F6] bg-white p-4">
          <h4 className="mb-2 text-[12px] font-extrabold text-[#6D4DE8]">次の一手</h4>
          <p className="text-[13px] font-bold leading-relaxed text-[#332B45]">{advice.nextStep}</p>
          <p className="mt-3 border-t border-[#EFE8F8] pt-3 text-[12px] font-bold leading-relaxed text-[#746B82]">
            {advice.psychologyNote}
          </p>
        </section>
        <p className="text-[11px] font-bold leading-relaxed text-[#8D839A]">{advice.caveat}</p>
      </div>
    </section>
  );
}

function PanelContent({
  selfMbti,
  person,
  selectedActionId,
  concern,
  advice,
  isGenerating,
  error,
  onPresetChange,
  onNotesChange,
  onClosenessChange,
  onStressChange,
  onActionChange,
  onConcernChange,
  onGenerateAdvice,
}: RelationshipPanelProps) {
  if (!person) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <h2 className="text-[24px] font-extrabold text-[#221B31]">人物を選択</h2>
        <p className="mt-3 text-sm font-bold leading-relaxed text-[#746B82]">
          周囲の人物スロットを選ぶと、相談アクションと関係メモが表示されます。
        </p>
      </div>
    );
  }

  const action = workplaceActions.find(item => item.id === selectedActionId) ?? workplaceActions[0];

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#EFE7DE] px-5 pb-5 pt-5 lg:px-6 lg:pt-7">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold text-[#6D4DE8]">RELATION SLOT</p>
            <h2 className="mt-1 truncate text-[26px] font-extrabold leading-tight text-[#17131f]">
              {person.name}
            </h2>
            <p className="mt-2 text-[13px] font-bold leading-relaxed text-[#746B82]">
              {person.preset.description}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-[#F1EDFF] px-3 py-1.5 text-[12px] font-extrabold text-[#6D4DE8]">
            {person.relationLabel}
          </span>
        </div>

        <label className="block">
          <span className="mb-2 block text-[12px] font-extrabold text-[#5B536C]">人物プリセット</span>
          <select
            value={person.presetId}
            onChange={(event) => onPresetChange(event.target.value)}
            className="w-full rounded-[14px] border border-[#E8DED3] bg-white px-4 py-3 text-[14px] font-bold text-[#221B31] outline-none focus:border-[#A77CFF] focus:ring-4 focus:ring-[#EEE8FF]"
          >
            {workplacePresets.map(preset => (
              <option key={preset.id} value={preset.id}>
                {preset.roleLabel} - {preset.displayName}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[14px] bg-[#F7F4EF] p-3">
            <p className="text-[10px] font-extrabold text-[#8D839A]">推定タイプ</p>
            <p className="mt-1 text-[14px] font-extrabold text-[#221B31]">
              {person.preset.estimatedMbti.join(' / ')}
            </p>
          </div>
          <div className="rounded-[14px] bg-[#F7F4EF] p-3">
            <p className="text-[10px] font-extrabold text-[#8D839A]">確信度</p>
            <p className="mt-1 text-[14px] font-extrabold text-[#221B31]">
              {confidenceLabels[person.preset.confidence]} / 仮説
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 lg:px-6">
        <div className="grid gap-4">
          <section className="rounded-[18px] border border-[#EEE7DE] bg-white/86 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-extrabold text-[#221B31]">関係メモ</h3>
                <p className="mt-1 text-[12px] font-bold text-[#746B82]">あとから実在の相手に合わせて調整できます。</p>
              </div>
              <span className="rounded-full bg-[#F1EDFF] px-3 py-1 text-[11px] font-extrabold text-[#6D4DE8]">
                自分: {selfMbti}
              </span>
            </div>
            <textarea
              value={person.notes}
              onChange={(event) => onNotesChange(event.target.value)}
              rows={4}
              className="w-full resize-none rounded-[14px] border border-[#E8DED3] bg-[#FFFDFC] px-4 py-3 text-[13px] font-bold leading-relaxed text-[#332B45] outline-none focus:border-[#A77CFF] focus:ring-4 focus:ring-[#EEE8FF]"
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label>
                <span className="mb-2 flex justify-between text-[11px] font-extrabold text-[#746B82]">
                  <span>信頼度</span>
                  <span>{person.closeness}</span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={person.closeness}
                  onChange={(event) => onClosenessChange(Number(event.target.value))}
                  className="w-full accent-[#18A879]"
                />
              </label>
              <label>
                <span className="mb-2 flex justify-between text-[11px] font-extrabold text-[#746B82]">
                  <span>心理的負荷</span>
                  <span>{person.stress}</span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={person.stress}
                  onChange={(event) => onStressChange(Number(event.target.value))}
                  className="w-full accent-[#EF5555]"
                />
              </label>
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-2">
            <SectionList title="信頼の作り方" items={person.preset.trustSignals} />
            <SectionList title="地雷になりやすいこと" items={person.preset.riskTriggers} />
          </div>

          <section className="rounded-[18px] border border-[#EEE7DE] bg-white/86 p-4">
            <h3 className="text-[15px] font-extrabold text-[#221B31]">この人と何をしたい？</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {workplaceActions.map(item => {
                const isSelected = item.id === selectedActionId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onActionChange(item.id)}
                    className={[
                      'min-h-[70px] rounded-[14px] border px-3 py-3 text-left transition-all',
                      isSelected
                        ? 'border-[#A77CFF] bg-[#F1EDFF] text-[#4F35C9] shadow-[0_10px_24px_rgba(86,48,209,0.13)]'
                        : 'border-[#EEE7DE] bg-white text-[#332B45] hover:border-[#B99BFF]',
                    ].join(' ')}
                  >
                    <span className="block text-[13px] font-extrabold">{item.label}</span>
                    <span className="mt-1 block text-[11px] font-bold leading-snug opacity-75">{item.description}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[18px] border border-[#EEE7DE] bg-white/86 p-4">
            <h3 className="text-[15px] font-extrabold text-[#221B31]">相談内容</h3>
            <p className="mt-1 text-[12px] font-bold leading-relaxed text-[#746B82]">
              選択中: {action.label}。具体的な状況を書くほど、会話の切り出し方が実用的になります。
            </p>
            <textarea
              value={concern}
              onChange={(event) => onConcernChange(event.target.value)}
              rows={4}
              placeholder="例: 来週の締切に間に合わなそうです。上司に早めに相談したいが、詰められそうで怖いです。"
              className="mt-3 w-full resize-none rounded-[14px] border border-[#E8DED3] bg-[#FFFDFC] px-4 py-3 text-[13px] font-bold leading-relaxed text-[#332B45] outline-none placeholder:text-[#A49AAE] focus:border-[#A77CFF] focus:ring-4 focus:ring-[#EEE8FF]"
            />
            {error && (
              <p className="mt-3 rounded-[12px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-bold text-red-600">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={onGenerateAdvice}
              disabled={isGenerating}
              className="mt-3 flex w-full items-center justify-center rounded-[14px] bg-gradient-to-r from-[#7A62E8] to-[#5430D1] px-4 py-3 text-[14px] font-extrabold text-white shadow-[0_14px_28px_rgba(86,48,209,0.22)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isGenerating ? 'シミュレーション中...' : '方針と文面を作る'}
            </button>
          </section>

          {advice && <AdviceResult advice={advice} />}
        </div>
      </div>
    </div>
  );
}

export default function RelationshipPanel(props: RelationshipPanelProps) {
  return (
    <>
      <aside className="hidden w-[430px] shrink-0 border-l border-[#E8DED3] bg-white/92 shadow-[0_0_44px_rgba(45,33,68,0.08)] backdrop-blur-xl lg:flex lg:h-dvh lg:flex-col">
        <PanelContent {...props} />
      </aside>

      <section className="fixed inset-x-3 bottom-3 z-40 h-[62dvh] overflow-hidden rounded-[22px] border border-[#E8DED3] bg-white/96 shadow-[0_20px_44px_rgba(36,25,58,0.18)] backdrop-blur-xl lg:hidden">
        <PanelContent {...props} />
      </section>
    </>
  );
}
