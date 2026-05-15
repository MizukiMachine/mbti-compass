'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import WorkplaceMapCanvas from './WorkplaceMapCanvas';
import RelationshipPanel from './RelationshipPanel';
import {
  createDefaultWorkplacePeople,
  createWorkplacePerson,
} from '../../src/data/workplace-presets';
import {
  AdviceActionId,
  WorkplaceAdviceResponse,
  WorkplacePerson,
} from '../../src/types/workplace';

const RESULT_STORAGE_KEY = 'office-compass-self-result';
const LEGACY_RESULT_STORAGE_KEY = 'mbti-shadow-friend-result';
const MAP_STORAGE_PREFIX = 'workplace-relationship-map-v1';

type SavedPerson = Omit<WorkplacePerson, 'preset'>;

interface SavedMap {
  people: SavedPerson[];
  selectedPersonId: string | null;
}

function getMapStorageKey(mbtiType: string, name: string) {
  const owner = `${name || 'guest'}-${mbtiType}`.replace(/\s+/g, '-').toLowerCase();
  return `${MAP_STORAGE_PREFIX}-${owner}`;
}

function serializePeople(people: WorkplacePerson[]): SavedPerson[] {
  return people.map(({ preset: _preset, ...person }) => person);
}

function hydratePeople(saved: SavedPerson[] | undefined): WorkplacePerson[] {
  if (!saved || saved.length === 0) return createDefaultWorkplacePeople();

  return saved.map(person => createWorkplacePerson({
    id: person.id,
    presetId: person.presetId,
    relationLabel: person.relationLabel,
    name: person.name,
    closeness: person.closeness,
    stress: person.stress,
    notes: person.notes,
  }));
}

function LogoMark({ className = 'h-11 w-11' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M24 41V23" stroke="#7D66D9" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 40h16" stroke="#7D66D9" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="15" r="5.5" fill="#6D4DE8" />
      <circle cx="15" cy="19" r="3.4" fill="#FF7A45" />
      <circle cx="33" cy="19" r="3.4" fill="#3D7BEF" />
      <circle cx="18" cy="10" r="2.4" fill="#FFB35C" />
      <circle cx="30" cy="10" r="2.4" fill="#F56E9C" />
      <circle cx="10" cy="27" r="2" fill="#8D6AF2" />
      <circle cx="38" cy="27" r="2" fill="#18A879" />
    </svg>
  );
}

function ExplorePageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-4 rounded-full bg-white px-6 py-4 shadow-[0_18px_44px_rgba(45,33,68,0.10)]">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#6D4DE8] border-t-transparent" />
        <span className="text-sm font-extrabold text-[#332B45]">関係マップを準備中...</span>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExplorePageFallback />}>
      <ExploreContent />
    </Suspense>
  );
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mbtiType = searchParams.get('mbti') || '';
  const selfName = searchParams.get('name') || '';
  const [people, setPeople] = useState<WorkplacePerson[]>(() => createDefaultWorkplacePeople());
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>('slot-manager');
  const [selectedActionId, setSelectedActionId] = useState<AdviceActionId>('build_trust');
  const [concern, setConcern] = useState('');
  const [advice, setAdvice] = useState<WorkplaceAdviceResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedMap, setHasLoadedMap] = useState(false);

  useEffect(() => {
    if (!mbtiType) {
      const stored = localStorage.getItem(RESULT_STORAGE_KEY) ?? localStorage.getItem(LEGACY_RESULT_STORAGE_KEY);
      if (stored) {
        try {
          const { type, name } = JSON.parse(stored);
          const params = new URLSearchParams();
          if (type) params.set('mbti', type);
          if (name) params.set('name', name);
          router.replace(`/explore?${params.toString()}`);
          return;
        } catch {
          localStorage.removeItem(RESULT_STORAGE_KEY);
        }
      }
      router.replace('/');
    }
  }, [mbtiType, router]);

  useEffect(() => {
    if (!mbtiType) return;

    const storageKey = getMapStorageKey(mbtiType, selfName);
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      const defaults = createDefaultWorkplacePeople();
      setPeople(defaults);
      setSelectedPersonId(defaults[0]?.id ?? null);
      setHasLoadedMap(true);
      return;
    }

    try {
      const saved = JSON.parse(stored) as SavedMap;
      const hydrated = hydratePeople(saved.people);
      setPeople(hydrated);
      setSelectedPersonId(saved.selectedPersonId ?? hydrated[0]?.id ?? null);
    } catch {
      const defaults = createDefaultWorkplacePeople();
      setPeople(defaults);
      setSelectedPersonId(defaults[0]?.id ?? null);
      localStorage.removeItem(storageKey);
    } finally {
      setHasLoadedMap(true);
    }
  }, [mbtiType, selfName]);

  useEffect(() => {
    if (!mbtiType || !hasLoadedMap) return;
    const storageKey = getMapStorageKey(mbtiType, selfName);
    const saved: SavedMap = {
      people: serializePeople(people),
      selectedPersonId,
    };
    localStorage.setItem(storageKey, JSON.stringify(saved));
  }, [hasLoadedMap, mbtiType, people, selectedPersonId, selfName]);

  const selectedPerson = useMemo(
    () => people.find(person => person.id === selectedPersonId) ?? people[0] ?? null,
    [people, selectedPersonId],
  );

  const updateSelectedPerson = (updater: (person: WorkplacePerson) => WorkplacePerson) => {
    if (!selectedPerson) return;
    setPeople(current => current.map(person => (
      person.id === selectedPerson.id ? updater(person) : person
    )));
  };

  const handlePresetChange = (presetId: string) => {
    updateSelectedPerson(person => createWorkplacePerson({
      id: person.id,
      presetId,
      relationLabel: person.relationLabel,
      closeness: person.closeness,
      stress: person.stress,
    }));
    setAdvice(null);
    setError(null);
  };

  const handleGenerateAdvice = async () => {
    if (!selectedPerson) return;

    setIsGenerating(true);
    setError(null);
    setAdvice(null);

    try {
      const response = await fetch('/api/workplace/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selfMbti: mbtiType,
          selfName,
          person: selectedPerson,
          actionId: selectedActionId,
          userConcern: concern,
        }),
      });

      if (!response.ok) throw new Error('相談結果の生成に失敗しました');
      const data = await response.json() as WorkplaceAdviceResponse;
      setAdvice(data);
    } catch {
      setError('相談結果を生成できませんでした。少し時間を置いてもう一度試してください。');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!mbtiType) {
    return <ExplorePageFallback />;
  }

  return (
    <div className="flex h-dvh w-screen overflow-hidden bg-background font-sans text-[#17131f]">
      <aside className="hidden w-[300px] shrink-0 flex-col border-r border-[#E8DED3] bg-[#FBFAF7]/95 px-5 py-6 2xl:flex">
        <div className="mb-8 flex items-center gap-3">
          <LogoMark />
          <div>
            <p className="text-[11px] font-extrabold text-[#7A62E8]">OFFICE COMPASS</p>
            <p className="text-[22px] font-extrabold leading-tight text-[#17131f]">職場関係マップ</p>
          </div>
        </div>

        <section className="rounded-[22px] bg-white p-5 shadow-[0_14px_36px_rgba(45,33,68,0.08)]">
          <p className="text-[11px] font-extrabold text-[#8D839A]">自分の診断</p>
          <h1 className="mt-2 text-[56px] font-extrabold leading-none text-[#5B42D2]">{mbtiType}</h1>
          <p className="mt-3 truncate text-[15px] font-extrabold text-[#2A2338]">{selfName || 'あなた'}</p>
          <p className="mt-4 text-[13px] font-bold leading-relaxed text-[#746B82]">
            MBTIは断定ではなく、職場コミュニケーションの仮説を組み立てる補助情報として使います。
          </p>
        </section>

        <section className="mt-4 rounded-[20px] bg-white p-5 shadow-[0_14px_36px_rgba(45,33,68,0.06)]">
          <p className="text-[12px] font-extrabold text-[#5B536C]">使い方</p>
          <ol className="mt-4 space-y-3 text-[13px] font-bold leading-relaxed text-[#3D354B]">
            <li>1. 周囲の人物スロットを選ぶ</li>
            <li>2. プリセットやメモを調整する</li>
            <li>3. 相談アクションを選ぶ</li>
            <li>4. 方針、文面、次の一手を生成する</li>
          </ol>
        </section>

        <button
          type="button"
          onClick={() => router.push('/')}
          className="mt-auto rounded-[16px] border border-[#E8DED3] bg-white px-4 py-3 text-[13px] font-extrabold text-[#5B536C] transition-colors hover:text-[#6D4DE8]"
        >
          自分診断をやり直す
        </button>
      </aside>

      <WorkplaceMapCanvas
        selfName={selfName}
        selfMbti={mbtiType}
        people={people}
        selectedPersonId={selectedPerson?.id ?? null}
        onSelectPerson={(personId) => {
          setSelectedPersonId(personId);
          setAdvice(null);
          setError(null);
        }}
      />

      <RelationshipPanel
        selfMbti={mbtiType}
        person={selectedPerson}
        selectedActionId={selectedActionId}
        concern={concern}
        advice={advice}
        isGenerating={isGenerating}
        error={error}
        onPresetChange={handlePresetChange}
        onNotesChange={(notes) => updateSelectedPerson(person => ({ ...person, notes }))}
        onClosenessChange={(closeness) => updateSelectedPerson(person => ({ ...person, closeness }))}
        onStressChange={(stress) => updateSelectedPerson(person => ({ ...person, stress }))}
        onActionChange={(actionId) => {
          setSelectedActionId(actionId);
          setAdvice(null);
          setError(null);
        }}
        onConcernChange={setConcern}
        onGenerateAdvice={handleGenerateAdvice}
      />
    </div>
  );
}
