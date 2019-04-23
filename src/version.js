version(timestamp) {
	// const タイムスタンプ
	// let versionナンバー 1→2→3
	// const 変更日 = ['2019/04/23','2019/05/18']
	// 変更日[0] ←バージョン
	// タイムスタンプが変更日のどの値より小さい＝早いかを判定
	
	const verNum = 1;
	return `ver${verNum}` //クラスネームを返す
}