# Corporate DLP Blocklist

## 개요
사내 외부망에서 정보 및 자료 유출을 방지하기 위한 차단 목록입니다.

## 생성일
2026-01-29

## 파일 구조

```
blockList/
├── 01_webmail.txt              # 웹메일 서비스 (Gmail, Naver Mail, 등)
├── 02_cloud_storage.txt        # 클라우드 스토리지 (Google Drive, Dropbox, 등)
├── 03_messaging_chat.txt       # 메신저/채팅 (Discord, Telegram, Slack, 등)
├── 04_temporary_email.txt      # 임시/일회용 이메일 서비스
├── 05_pastebin_code_sharing.txt # 코드/텍스트 공유 서비스
├── 06_social_media_with_dm.txt  # DM 기능이 있는 소셜 미디어
├── 07_vpn_proxy_anonymizer.txt  # VPN, 프록시, 익명화 서비스
├── 08_remote_access.txt         # 원격 접속 도구
├── 09_ai_llm_services.txt       # AI/LLM 서비스 (ChatGPT, Claude, 등)
├── 10_form_survey_services.txt  # 폼/설문조사 서비스
└── README.md                    # 이 파일
```

## 카테고리별 설명

### 01. 웹메일 (Webmail)
- 글로벌 제공업체: Gmail, Outlook, Yahoo Mail, AOL 등
- 한국: mail.naver.com, mail.daum.net, mail.kakao.com
- 중국: mail.qq.com, mail.163.com, mail.126.com
- 일본: mail.yahoo.co.jp, mail.goo.ne.jp
- 러시아: mail.yandex.ru, e.mail.ru
- 유럽: GMX, Web.de, Orange, Libero 등
- 프라이버시 중심: ProtonMail, Tutanota, Mailfence 등

### 02. 클라우드 스토리지 (Cloud Storage)
- 주요 서비스: Google Drive, Dropbox, OneDrive, MEGA, Box
- 파일 전송: WeTransfer, SendAnywhere, Smash
- 지역별: Naver MYBOX, Baidu Pan, Yandex Disk
- P2P 공유: SnapDrop, ShareDrop, Wormhole
- 임시 파일 호스팅: gofile.io, file.io, catbox.moe

### 03. 메신저/채팅 (Messaging & Chat)
- 주요 메신저: WhatsApp Web, Telegram, Discord, Skype
- 소셜 메시징: Facebook Messenger, Instagram DM, Twitter DM
- 협업 도구: Slack, Microsoft Teams, Google Chat
- 익명 채팅: Omegle, Chatroulette
- IRC 웹 클라이언트: IRCCloud, KiwiIRC

### 04. 임시 이메일 (Temporary Email)
- 주요 서비스: 10MinuteMail, Guerrilla Mail, Mailinator, YOPmail
- 익명 이메일: TempMail, ThrowawayMail
- 이메일 마스킹: Firefox Relay, SimpleLogin, Duck.com
- 수천 개의 일회용 도메인 포함

### 05. 페이스트빈/코드 공유 (Pastebin & Code Sharing)
- 주요 서비스: Pastebin, GitHub Gist, PrivateBin
- 개발자 도구: CodePen, JSFiddle, CodeSandbox, Replit
- 암호화 페이스트: 0bin, CryptBin, GhostBin

### 06. DM 기능이 있는 소셜 미디어
- 글로벌: Facebook, Instagram, Twitter/X, LinkedIn, Reddit
- 한국: Naver Cafe, Band, KakaoStory
- 중국: Weibo, QQ, WeChat
- 분산형: Mastodon, Lemmy, Bluesky
- 게이밍: Steam, Twitch, Discord

### 07. VPN/프록시/익명화 도구
- VPN 제공업체: NordVPN, ExpressVPN, ProtonVPN 등
- 웹 프록시: KProxy, HideMyAss, ProxySite
- Tor 관련: Tor Project, Onion 라우팅 서비스
- DNS 우회: Cloudflare DNS, Google DNS, NextDNS

### 08. 원격 접속 도구
- 주요 도구: TeamViewer, AnyDesk, Parsec
- 화면 공유: Loom, Screenleap
- 클라우드 개발환경: GitHub Codespaces, Gitpod, Replit

### 09. AI/LLM 서비스
- 챗봇: ChatGPT, Claude, Gemini, Copilot
- AI 글쓰기: Jasper, Copy.ai, Grammarly
- AI 코딩: GitHub Copilot, Tabnine, Cursor
- AI 이미지: DALL-E, Midjourney, Stable Diffusion

### 10. 폼/설문조사 서비스
- 주요 서비스: Google Forms, Microsoft Forms, Typeform
- 설문조사: SurveyMonkey, Qualtrics
- 피드백 도구: Hotjar, UserVoice

## 사용 방법

### 방화벽/프록시 설정
```bash
# 모든 파일 병합
cat blockList/*.txt | grep -v "^#" | grep -v "^$" | sort -u > combined_blocklist.txt
```

### 도메인 수
- 총 도메인 수: 약 3,000+ 개
- 임시 이메일만: 약 1,500+ 개

## 주의사항

1. **허용 목록과 병행 사용**: 업무에 필요한 서비스는 허용 목록에 별도 등록
2. **정기 업데이트 필요**: 새로운 서비스가 계속 등장하므로 월별 검토 권장
3. **사용자 공지**: 차단 정책 시행 전 직원들에게 사전 안내 필요
4. **예외 처리**: 업무상 필요한 경우 예외 신청 프로세스 구축

## 라이선스
내부 사용 전용

## 연락처
보안팀에 문의하세요.
