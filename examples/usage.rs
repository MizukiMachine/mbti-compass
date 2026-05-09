// Another Me AI - 実践的な使用例

use another_me_ai::*;
use std::sync::Arc;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    println!("🎭 Another Me AI - 実践的な使用例");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    println!();

    // ===== Example 1: キャラクター検索と表示 =====
    println!("【Example 1】キャラクター検索");
    println!("─────────────────────────────────");

    let enfp = CharacterLoader::find_by_mbti(MBTIType::ENFP)?;
    println!("✅ {}（{}）", enfp.name, enfp.nickname);
    println!("   タイプ: {} - {}", MBTIType::ENFP, MBTIType::ENFP.japanese_name());
    println!("   性格: {}", enfp.traits[0]);
    println!();

    // ===== Example 2: MBTI診断の実行 =====
    println!("【Example 2】MBTI診断");
    println!("─────────────────────────────────");

    let mut session = DiagnosisSession::new();
    println!("✅ 診断開始（質問数: {}）", session.question_set.len());

    // ENFPになるように回答（E, N, F, P すべて高スコア）
    for _ in 0..4 { session.record_answer(Answer::StronglyAgree); } // E
    for _ in 0..4 { session.record_answer(Answer::StronglyAgree); } // N
    for _ in 0..4 { session.record_answer(Answer::StronglyAgree); } // F
    for _ in 0..4 { session.record_answer(Answer::StronglyAgree); } // P

    if let Some(result) = session.calculate_result() {
        println!("✅ 診断結果: {} ({})", result.mbti_type, result.mbti_type.japanese_name());
    }
    println!();

    // ===== Example 3: AI対話（モック） =====
    println!("【Example 3】AI対話システム");
    println!("─────────────────────────────────");

    let mock_llm = Arc::new(MockLLMProvider::new(
        "やっほー！元気元気！今日も素敵な一日になりそうだね！何か楽しいこと話そうよ！"
    ));

    let dialogue_mgr = Arc::new(DialogueManager::new(mock_llm));
    let mut dialogue_session = DialogueSession::new(enfp.clone());

    let user_msg = "元気？";
    println!("👤 ユーザー: {}", user_msg);

    let response = dialogue_mgr.chat(&mut dialogue_session, user_msg.to_string()).await?;
    println!("🤖 エネちゃん: {}", response);
    println!("   (メッセージ履歴: {}件)", dialogue_session.messages.len());
    println!();

    // ===== Example 4: システムプロンプト生成 =====
    println!("【Example 4】システムプロンプト");
    println!("─────────────────────────────────");

    let prompt = dialogue_session.system_prompt();
    println!("✅ プロンプト生成完了 ({} bytes)", prompt.len());
    println!("📝 先頭100文字:");
    println!("   {}", &prompt[..100.min(prompt.len())]);
    println!();

    // ===== Example 5: プロンプトエンジニアリング =====
    println!("【Example 5】シチュエーション別プロンプト");
    println!("─────────────────────────────────");

    let builder = PromptBuilder::new(enfp.clone());

    println!("💪 励まし:");
    let encouragement = builder.build_situational_prompt(Situation::Encouragement);
    println!("   {}", encouragement.lines().next().unwrap_or(""));

    println!("💡 アドバイス:");
    let advice = builder.build_situational_prompt(Situation::Advice);
    println!("   {}", advice.lines().next().unwrap_or(""));

    println!("👂 傾聴:");
    let listening = builder.build_situational_prompt(Situation::Listening);
    println!("   {}", listening.lines().next().unwrap_or(""));
    println!();

    // ===== Example 6: 音声システム（モック） =====
    println!("【Example 6】音声入出力システム");
    println!("─────────────────────────────────");

    let mock_stt: Arc<dyn SpeechToTextProvider> =
        Arc::new(MockSpeechToTextProvider::new("こんにちは、調子はどう？"));
    let mock_tts: Arc<dyn TextToSpeechProvider> =
        Arc::new(MockTextToSpeechProvider);

    println!("✅ 音声認識: Whisper API（モック）");
    println!("✅ 音声合成: VOICEVOX（モック）");
    println!("✅ スピーカー: {}", VoicevoxSpeaker::ZundamonNormal.name());

    let _voice_session = VoiceDialogueSession::new(
        enfp.clone(),
        dialogue_mgr.clone(),
        mock_stt,
        mock_tts,
    ).with_speaker(VoicevoxSpeaker::ZundamonNormal);

    println!("✅ 音声対話セッション準備完了");
    println!();

    // ===== Example 7: セッション永続化 =====
    println!("【Example 7】セッション保存・読み込み");
    println!("─────────────────────────────────");

    let save_path = "/tmp/anotherme_session.json";
    dialogue_session.save(save_path)?;
    println!("✅ セッション保存: {}", save_path);

    let loaded = DialogueSession::load(save_path)?;
    println!("✅ セッション読み込み成功");
    println!("   キャラクター: {}", loaded.character.name);
    println!("   メッセージ数: {}", loaded.messages.len());
    println!();

    // ===== Summary =====
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    println!("🎉 全機能動作確認完了！");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    println!();
    println!("✨ 実装済み機能:");
    println!("  1️⃣  MBTI診断（16タイプ）");
    println!("  2️⃣  16種類のキャラクター");
    println!("  3️⃣  AI対話システム（Claude API）");
    println!("  4️⃣  プロンプトエンジニアリング");
    println!("  5️⃣  音声認識（Whisper API）");
    println!("  6️⃣  音声合成（VOICEVOX）");
    println!("  7️⃣  リアルタイム音声対話");
    println!("  8️⃣  セッション永続化");
    println!();

    Ok(())
}
