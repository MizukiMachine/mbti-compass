use clap::{Parser, Subcommand};
use colored::*;
use another_me_ai::*;

#[derive(Parser)]
#[command(name = "another-me-ai")]
#[command(about = "もう一人の自分 - MBTI性格診断で見つけるあなたの分身AI", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// 性格診断を開始
    Diagnose,
    /// 診断結果を表示
    ShowResult,
    /// 16種類のキャラクター一覧を表示
    ListCharacters,
    /// メモリ管理コマンド
    Memory {
        #[command(subcommand)]
        action: MemoryAction,
    },
}

#[derive(Subcommand)]
enum MemoryAction {
    /// 新しいメモリを作成
    Create {
        /// ユーザーID
        #[arg(short, long)]
        user_id: String,
        /// コンパニオンID
        #[arg(short, long)]
        companion_id: String,
        /// メモリ内容
        #[arg(short = 't', long)]
        content: String,
        /// カテゴリ (conversation, preference, event, emotion, fact, relationship, reference)
        #[arg(short = 'c', long, default_value = "conversation")]
        category: String,
        /// 重要度 (0.0-1.0)
        #[arg(short, long, default_value = "0.5")]
        importance: f32,
    },
    /// メモリを検索
    Search {
        /// 検索クエリ
        query: String,
        /// ユーザーID
        #[arg(short, long)]
        user_id: Option<String>,
        /// コンパニオンID
        #[arg(short, long)]
        companion_id: Option<String>,
        /// カテゴリフィルタ
        #[arg(short = 'c', long)]
        category: Option<String>,
        /// 最小重要度
        #[arg(short = 'm', long)]
        min_importance: Option<f32>,
        /// 結果数上限
        #[arg(short, long, default_value = "10")]
        limit: usize,
    },
    /// メモリを削除
    Delete {
        /// メモリID
        memory_id: String,
    },
    /// メモリ統計を表示
    Stats,
    /// 古いメモリをクリーンアップ
    Cleanup,
}

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new("info")),
        )
        .init();

    let cli = Cli::parse();

    match &cli.command {
        Some(Commands::Diagnose) => run_diagnosis(),
        Some(Commands::ShowResult) => show_result(),
        Some(Commands::ListCharacters) => list_characters(),
        Some(Commands::Memory { action }) => {
            if let Err(e) = handle_memory_command(action).await {
                eprintln!("{}", format!("エラー: {}", e).bright_red());
                std::process::exit(1);
            }
        }
        None => show_help(),
    }
}

fn run_diagnosis() {
    println!("{}", "🎭 Another Me AI - 性格診断".bright_cyan().bold());
    println!();
    println!("あなたの分身となるもう一人の自分を見つけましょう！");
    println!("MBTIベースの診断を開始します。");
    println!();

    let mut session = DiagnosisSession::new();

    while !session.is_complete() {
        if let Some(question) = session.current_question_text() {
            println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            println!(
                "{} {}/{}",
                "質問".bright_yellow(),
                session.current_question + 1,
                session.question_set.len()
            );
            println!();
            println!("{}", question.text.bright_white().bold());
            println!();
            println!("  {} まったくそう思わない", "1.".bright_red());
            println!("  {} そう思わない", "2.".bright_red());
            println!("  {} どちらでもない", "3.".bright_yellow());
            println!("  {} そう思う", "4.".bright_green());
            println!("  {} 強くそう思う", "5.".bright_green());
            println!();

            use std::io::{self, Write};
            print!("選択 (1-5): ");
            io::stdout().flush().unwrap();

            let mut input = String::new();
            io::stdin().read_line(&mut input).unwrap();

            if let Ok(num) = input.trim().parse::<u8>() {
                if let Some(answer) = Answer::from_u8(num) {
                    session.record_answer(answer);
                    println!();
                } else {
                    println!("{}", "無効な入力です。1-5の数字を入力してください。".bright_red());
                }
            } else {
                println!("{}", "無効な入力です。1-5の数字を入力してください。".bright_red());
            }
        }
    }

    // 診断結果の表示
    if let Some(result) = session.calculate_result() {
        println!();
        println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        println!("{}", "🎉 診断完了！".bright_cyan().bold());
        println!();

        // キャラクター情報取得
        if let Ok(character) = CharacterLoader::find_by_mbti(result.mbti_type) {
            println!("{}", format!("あなたのタイプ: {} ({})", result.mbti_type, result.mbti_type.japanese_name()).bright_magenta().bold());
            println!();
            println!("┌──────────────────────────────────────┐");
            println!("│ {}                        │", "あなたのもう一人の自分".bright_cyan().bold());
            println!("├──────────────────────────────────────┤");
            println!("│ 名前: {} ({})                     │", character.name.bright_white(), character.nickname);
            println!("│ タイプ: {} - {}                 │", result.mbti_type, result.mbti_type.japanese_name());
            println!("│                                       │");
            println!("│ {}:                                 │", "性格".bright_yellow());
            for trait_text in &character.traits {
                println!("│  - {}                     │", trait_text);
            }
            println!("│                                       │");
            println!("│ {}:                       │", "得意なサポート".bright_green());
            for strength in &character.strengths {
                println!("│  - {}                     │", strength);
            }
            println!("└──────────────────────────────────────┘");
        }

        println!();
        println!("💾 診断結果を保存しました");
    }
}

fn show_result() {
    println!("{}", "📊 診断結果".bright_green().bold());
    println!();
    println!("診断結果の保存・読み込み機能は今後実装予定です。");
}

fn list_characters() {
    println!("{}", "🎭 16種類のキャラクター".bright_magenta().bold());
    println!();

    match CharacterLoader::load_all() {
        Ok(characters) => {
            for character in characters {
                println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                println!(
                    "{} {} ({}) - {}",
                    character.mbti_type,
                    character.name.bright_cyan(),
                    character.nickname,
                    character.mbti_type.japanese_name().bright_yellow()
                );
                println!();
                println!("性格:");
                for trait_text in &character.traits {
                    println!("  - {}", trait_text);
                }
                println!();
            }
        }
        Err(e) => {
            println!("{}", format!("エラー: {}", e).bright_red());
        }
    }
}

fn show_help() {
    println!("{}", "🎭 Another Me AI - もう一人の自分 - MBTI性格診断で見つけるあなたの分身AI".bright_cyan().bold());
    println!();
    println!("使い方:");
    println!("  {} - 性格診断を開始", "another-me-ai diagnose".bright_yellow());
    println!("  {} - 診断結果を表示", "another-me-ai show-result".bright_yellow());
    println!("  {} - キャラクター一覧", "another-me-ai list-characters".bright_yellow());
    println!("  {} - メモリ管理", "another-me-ai memory <action>".bright_yellow());
    println!();
    println!(
        "詳細: {} または {}",
        "another-me-ai --help".bright_yellow(),
        "another-me-ai <command> --help".bright_yellow()
    );
}

async fn handle_memory_command(action: &MemoryAction) -> anyhow::Result<()> {
    use another_me_ai::memory::{MemoryCategory, MemoryQuery, MemoryService};
    use uuid::Uuid;

    let service = MemoryService::from_env().await?;

    match action {
        MemoryAction::Create {
            user_id,
            companion_id,
            content,
            category,
            importance,
        } => {
            let user_uuid = Uuid::parse_str(user_id)?;
            let category_enum = parse_category(category)?;

            println!("{}", "💾 メモリを作成中...".bright_cyan());

            let memory = service
                .create_memory(
                    user_uuid,
                    companion_id.clone(),
                    content.clone(),
                    category_enum,
                    *importance,
                )
                .await?;

            println!("{}", "✅ メモリが作成されました".bright_green().bold());
            println!();
            println!("ID: {}", memory.id);
            println!("カテゴリ: {:?}", memory.category);
            println!("重要度: {:.2}", memory.importance);
            println!("作成日時: {}", memory.timestamp);
        }

        MemoryAction::Search {
            query,
            user_id,
            companion_id,
            category,
            min_importance,
            limit,
        } => {
            println!("{}", format!("🔍 検索中: {}", query).bright_cyan());
            println!();

            let mut query_builder = MemoryQuery::new().limit(*limit);

            if let Some(uid) = user_id {
                query_builder = query_builder.user_id(Uuid::parse_str(uid)?);
            }

            if let Some(cid) = companion_id {
                query_builder = query_builder.companion_id(cid.clone());
            }

            if let Some(cat) = category {
                query_builder = query_builder.category(parse_category(cat)?);
            }

            if let Some(min_imp) = min_importance {
                query_builder = query_builder.min_importance(*min_imp);
            }

            let results = service.search_memories(query, query_builder).await?;

            if results.is_empty() {
                println!("{}", "検索結果がありません".bright_yellow());
            } else {
                println!(
                    "{} {}件の結果",
                    "📝".bright_green(),
                    results.len()
                );
                println!();

                for (i, result) in results.iter().enumerate() {
                    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                    println!(
                        "{} {} (類似度: {:.2}%)",
                        format!("{}.", i + 1).bright_yellow(),
                        "メモリ".bright_white().bold(),
                        result.similarity * 100.0
                    );
                    println!();
                    println!("ID: {}", result.memory.id);
                    println!("内容: {}", result.memory.content.bright_white());
                    println!("カテゴリ: {:?}", result.memory.category);
                    println!("重要度: {:.2}", result.memory.importance);
                    println!("アクセス回数: {}", result.memory.access_count);
                    println!("作成日時: {}", result.memory.timestamp);
                    println!();
                }
            }
        }

        MemoryAction::Delete { memory_id } => {
            let uuid = Uuid::parse_str(memory_id)?;

            println!("{}", format!("🗑️  メモリを削除中: {}", uuid).bright_yellow());

            service.delete_memory(uuid).await?;

            println!("{}", "✅ メモリが削除されました".bright_green().bold());
        }

        MemoryAction::Stats => {
            println!("{}", "📊 メモリ統計".bright_cyan().bold());
            println!();

            let stats = service.get_stats().await?;

            println!("総メモリ数: {}", stats.total_memories);
            println!("保存期間: {}日", stats.retention_days);
        }

        MemoryAction::Cleanup => {
            println!("{}", "🧹 古いメモリをクリーンアップ中...".bright_yellow());

            let deleted_count = service.cleanup_old_memories().await?;

            println!(
                "{}",
                format!("✅ {}件のメモリを削除しました", deleted_count)
                    .bright_green()
                    .bold()
            );
        }
    }

    Ok(())
}

fn parse_category(s: &str) -> anyhow::Result<MemoryCategory> {
    match s.to_lowercase().as_str() {
        "conversation" => Ok(MemoryCategory::Conversation),
        "preference" => Ok(MemoryCategory::Preference),
        "event" => Ok(MemoryCategory::Event),
        "emotion" => Ok(MemoryCategory::Emotion),
        "fact" => Ok(MemoryCategory::Fact),
        "relationship" => Ok(MemoryCategory::Relationship),
        "reference" => Ok(MemoryCategory::Reference),
        _ => anyhow::bail!("Invalid category: {}. Valid options: conversation, preference, event, emotion, fact, relationship, reference", s),
    }
}
