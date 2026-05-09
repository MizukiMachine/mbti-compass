//! # Another Me AI（もう一人の自分）
//!
//! もう一人の自分 - MBTI性格診断で見つけるあなたの分身AI - 性格診断に基づくAIコンパニオンシステム
//!
//! ## モジュール
//!
//! - `character`: 16種類のキャラクター定義
//! - `diagnosis`: MBTI診断ロジック
//! - `llm`: LLM抽象化層（Phase 2.1）
//! - `dialogue`: 対話セッション管理（Phase 2.2）
//! - `prompt`: プロンプトエンジニアリング（Phase 2.3）
//! - `memory`: ベクトルデータベースメモリシステム（長期記憶）
//! - `sns`: SNS連携・自動サポート（Phase 4）

pub mod character;
pub mod diagnosis;
pub mod dialogue;
pub mod llm;
pub mod memory;
pub mod prompt;
pub mod sns;
// pub mod cli;        // Phase 1.3で実装

pub use character::*;
pub use diagnosis::*;
pub use dialogue::*;
pub use llm::*;
pub use memory::*;
pub use prompt::*;
pub use sns::*;
