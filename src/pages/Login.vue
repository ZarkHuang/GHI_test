<template>
  <div
    class="w-screen h-screen bg-gradient-to-r from-cyan-500 to-blue-500 flex flex-col justify-between items-center p-8">
    <!-- Logo -->
    <ResponsiveLogo />
    <div
      class="mx-auto rounded-md bg-white sm:pt-12 pb-8 pt-12 px-10 flex flex-col justify-between max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
      <form @submit.prevent="handlerLogin">
        <div class="flex flex-col ">
          <div class="mb-2">
            <p class="subTitle">帳號</p>
            <input type="text" placeholder="請輸入帳號" v-model="username"
              class="mt-1 border-[1px] w-full h-10 pl-3 hover:border-2  rounded outline-blue-200"
              autocomplete="username" />

          </div>
          <div class="mt-2">
            <p class="subTitle">密碼</p>
            <div class="relative">
              <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="請輸入密碼"
                class="mt-1 border-[1px] w-full h-10 pl-3 hover:border-2  rounded outline-blue-200"
                autocomplete="current-password" />

              <button type="button" @click="toggleShowPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <template v-if="showPassword">
                  <eyeClose/>
                </template>
                <template v-else>
                  <eye/>
                </template>
              </button>
            </div>
          </div>
        </div>
      </form>

      <div class="text-center my-6 flex items-center justify-center ">
        <button @click="openForgetPasswordModal" class="hover-underline-animation text-xs passwordForget">忘記密碼</button>
      </div>
      <n-modal v-model:show="showForgetPasswordModal">
        <n-card class="flex items-center justify-center relative w-[416px] sm:w-[416px] sm:pxx-5" style="height: 156px;">
          <button class="absolute top-3 right-3" @click="showForgetPasswordModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" class="feather feather-x w-3 h-3 sm:w-3 sm:h-3">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div class="flex flex-col items-center justify-center h-full">
            <p class="text-xl my-2 font-bold">忘記密碼</p>
            <p class="text-base">請聯繫相關人員</p>
          </div>
        </n-card>
      </n-modal>

      <button class="login custom-button hoverButton-custom" @click="handlerLogin">登入</button>
      <hr class="my-6 border-gray-300 w-full">
      <div class="flex flex-col sm:flex-row items-center justify-center mb-4">
        <GoogleLogin :callback="callback" />
      </div>
      <!-- google登入 -->
      <!-- <GoogleLogin :callback="callback">
        <button type="button" class="h-10 w-full rounded border-[1px] border-[#2C8EEE] hover:bg-blue-100 mb-5">
          <div class="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="w-6 h-6"
              viewBox="0 0 48 48">
              <defs>
                <path id="a"
                  d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
              </defs>
              <clipPath id="b">
                <use xlink:href="#a" overflow="visible" />
              </clipPath>
              <path clip-path="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
              <path clip-path="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
              <path clip-path="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
              <path clip-path="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
            </svg>
            <span class="ml-4">
              Log in
              with
              Google</span>
          </div>
        </button>
      </GoogleLogin> -->


      <div class="checkForm space-x-1 mt-10">
        <input type="checkbox" v-model="checkbox" class="">
        <span class="text-base">
          我已閱讀並同意
          <button @click="openPrivacyPolicyModal" class="hover-underline-animation text-base">隱私權政策</button>
          與
          <button @click="openUserAgreementModal" class="hover-underline-animation text-base">網站使用者協議</button>
        </span>
      </div>

      <!-- 隱私權政策 Modal -->
      <n-modal v-model:show="showPrivacyPolicyModal"
        class="overflow-y-auto max-h-[700px] md:max-h-[700px] w-11/12 max-w-xl md:max-w-2xl mx-auto">
        <n-card class="modalStylePublic modal-content text-center">
          <h2 class=" text-base font-semibold mb-4">隱私權政策</h2>
          <div class="modal-body space-y-4 text-left p-2.5">
            <button class="absolute top-3 right-3" @click="showPrivacyPolicyModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" class="feather feather-x w-3 h-3 sm:w-3 sm:h-3">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
            <!-- 模态内容 -->
            此隱私權政策說明長佳智能股份有限公司（以下簡稱「公司」）如何收集、處理和使用網站上獲得的個人資訊。請仔細閱讀以下隱私權政策條款。
            <br><br>
            1.資訊收集
            公司允許使用者於網站提供某些個人身分資訊（以下簡稱「使用者資訊」）。這些使用者資訊將用於提供使用者所需的服務（以下簡稱「服務」），並向使用者提供有關公司及其產品的相關資訊。使用者可根據本隱私權政策中的「選擇退出」部分的指示，選擇不接收此類資訊或服務。公司還可能根據網站使用者協議使用使用者資訊，該協議可以在網站上找到。
            <br><br>
            作為網站使用者，我們可能會收集與您相關的資訊，以協助診斷伺服器問題和管理網站，以提高服務品質。我們還可能會追蹤和分析使用者不具身分識別和總計的使用情況，以及統計數據，然後將這些資訊提供給公司的附屬公司（如在網站使用者協議中所定義），以履行各種報告義務以及用於業務或行銷目的。公司不會出售或出租您的資訊給第三方。
            <br><br>
            2.第三方網站
            網站可能包含連結到網際網路上其他網站的連結。公司對於這些網站的隱私權政策、做法、使用者協議或內容不承擔任何責任。您必須查看這些網站的使用者協議和隱私權政策聲明，以瞭解其政策和做法。在與這些網站互動時，您可能會向這些網站提供個人資訊，因此您將對這些資訊提供負責。
            <br><br>
            3.選擇退出
            在我們請求獲取關於使用者資訊時，我們提供了選擇退出接收我們和我們的合作夥伴所提供特定類型資訊的機會。此外，如果您曾訂閱接收關於我們服務的資料，對於不涉及您已訂購產品或服務的資料，您可透過下述方式，從我們的市場行銷資料庫中，刪除您的聯絡方式和其他資料，從而取消訂閱或選擇退出接收我們未來所有的行銷資訊：您只需將要求發送至
            service@everfortune.ai 信箱，主旨或回覆郵件中包含「使用者選擇退出」的字樣即可。我們將儘快處理您的要求。
            <br><br>
            4.隱私權政策變更
            公司保留隨時變更本隱私權政策的權利。我們將在此處公佈任何變更，以讓使用者瞭解我們將收集哪些資訊，可能如何使用這些資訊，以及是否將這些資訊披露給第三方。
          </div>
          <div class="flex justify-center mt-5">
            <button @click="closePrivacyPolicyModal" class="confirm-button">
              確定
            </button>
          </div>
        </n-card>
      </n-modal>


      <!-- 網站使用者協議 Modal -->
      <n-modal v-model:show="showUserAgreementModal"
        class="overflow-y-auto max-h-[700px] md:max-h-[700px] w-11/12 max-w-xl md:max-w-2xl mx-auto">
        <n-card class="modalStylePublic modal-content text-center">
          <h2 class="text-base font-semibold mb-4">網站使用者協議</h2>
          <div class="modal-body space-y-4 text-left p-2.5">
            <button class="absolute top-3 right-3" @click="showUserAgreementModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" class="feather feather-x w-3 h-3 sm:w-3 sm:h-3">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
            歡迎來到長佳智能智海系統（以下簡稱「本網站」），使用我們所提供之服務。以下所載的條款及條件管理本網站的使用，如果您使用本網站便對您具有法律約束力。如果您不同意其中的任何條款，請不要存取本網站，或以其他方式使用本網站或本網站上包含的任何資訊。請仔細閱讀本條款。
            <br><br>
            當您使用本網站時，即表示您同意接受所有條款的約束，而沒有任何限制或條件，並保證您有完整的權力和授權代表本人和/或作為您雇主的代理人簽訂本網站的使用者協議，以及您有完整的權力和授權承擔此處所述的責任。
            <br><br>
            1.使用網站
            本網站上所提供的一切資訊、文字、產品、軟體和服務，包括但不限於商標、服務標章、商品名稱、標誌、圖形和影像 (統稱為「內容」) 為本公司所有或授權本公司使用。內容也可能包含第三方所擁有的商標、服務標章和商品名稱。
            除非本網站中另有說明，否則僅授權您使用本內容作為內部業務用途，不得轉售或進一步散佈，且需遵從以下條件：
            <br><br>
            (1) 使用本內容的目的只能是按照使用條款的規定使用透過本網站所提供的服務或購買所提供的產品；且
            <br><br>
            (2) 本內容的任何副本或其中的組成部分都必須包含公司的著作權聲明，該聲明可以在本網站的首頁上找到。
            <br><br>
            如果您違反任何條款，這項授權便自動終止，而不會事先通知您。
            <br><br>
            未授予您任何其他使用、複製、公開展示、公開執行、散佈、儲存、變更或修改本內容的權限。未授予您使用公司的圖示、網站位址或以其他方式將其他網際網路網站鏈結到本網站的任何頁面的權限。您同意若未事先取得公司或其授權人
            (視情況而定) 的書面授權，則不會將本網站所包含或可從本網站存取的任何內容以「頁框」(frame) 或「映射」(mirror) 的方式存放在任何其他伺服器或網際網路的裝置上。
            <br><br>
            本內容中提及或透過本網站提供的任何產品、服務、流程或技術受本公司和/或其供應商和/或授權人所保留的智慧財產權保護。本網站所包含的內容均不得解釋為針對本公司或任何第三方的任何著作權、商業機密、專利、商標或其他智慧財產權
            (統稱為「智慧財產權」) 授予任何許可或權利，而且，除非此處有明文規定，否則本內容中提及的或透過本網站提供的產品、服務、流程或技術的所有此類智慧財產權明確由公司和/或公司的供應商和/或授權人 (視情況而定) 所保留。
            <br><br>
            2.第三方網站
            本網站可能會連結至網際網路上的其他網站，該網站並不受本公司的控制或維護。因此，當您使用該第三方網站連結，即代表同意本公司提供這類連結僅是為了使用方便，並不構成本公司對這些網站的背書，且代表同意本公司對於這類網站的內容、使用者協議或隱私權政策不負任何責任。
            <br><br>
            3.使用者資訊
            您在此授予本公司非專屬、全球永久授權、可轉授的許可，以使用、複製、修改、私下散佈、執行和顯示您送出給本網站的任何資訊和資料
            (以下簡稱為「使用者資訊」)，或將使用者資訊公開散佈給本公司的附屬公司，以及以任何其他形式、媒體或者目前已知或未來發展出的技術在其他作品中納入使用者資訊和其中的修改內容。公司將依照本網站上的隱私權政策使用使用者資訊。「附屬公司」一詞是指獨立的承包商、代表、銷售代理商和經銷商，以及與本公司有業務關係的其他實體。
            <br><br>
            您聲明並保證您所提供的使用者資訊正確且完整，並會適當更新使用者資訊以保持其正確性和完整性。
            <br><br>
            4.未授權的活動
            您確認您的使用者資訊和使用本網站上所包含的內容都受到著作權法、商標法、隱私和公眾資訊法、某些通訊法令和法規以及其他適用的法律和法規的約束，並同意對自己的行為完全負責。您同意不干擾其他使用者使用本網站，包括但不限於，在本網站散播任何病毒或發送廣告郵件、垃圾郵件、炸彈或未經請求的電子郵件。您還同意不在本網站上存放或使用本網站提供各種會傳播任何非法、惱人、騷擾、誹謗、中傷、辱駡、威脅、危害、低俗、猥褻或侵權行為的資料，或者任何會侵佔、侵犯或違反任何個人或實體的權利的資料。
            <br><br>
            5.賠償
            您同意賠償、捍衛和維護公司及其管理人員、董事和雇員，使其完全免受因第三方就以下行為進行索賠而產生的任何或所有要求、成本、損失、責任和費用的損害：(a) 您使用本網站，(b) 您違反任何條款，或 (c)
            您違反任何適用的法律、法規或任何第三方的權利。
            <br><br>
            6.擔保免責聲明
            除非此處另有明文規定，否則在適用法律允許的最大範圍內，公司係以「現狀」和「現樣」為基礎在網站上提供內容和任何其他資訊，而不做任何保證，無論是明示、默示、法定或其他形式，包括但不限於對適售性、特定目的之適用性以及不侵犯第三方權利的默示保證。公司對於網站使用者送出的任何使用者資訊或者網站所包含、引用或所連結的其他資訊中的錯誤、遺漏或不實陳述不負任何責任。
            <br><br>
            7.責任限制
            對於網站中所包含或引用的內容、資訊、資料或產品的正確性、可靠性或使用，公司不提供任何保證，也不做任何相關陳述，並拒絕對因此產生的任何損失進行賠償。使用本網站即表示您同意自行承擔風險，並同意對使用本網站所發生的一切相關費用負全部責任，包括但不限於對您所使用的任何與使用本網站相關的設備進行所有必要的維護或修理所產生的費用。
            <br><br>
            透過本網站購買的任何物品或貨物均受公司的標準銷售條款和條件的約束，並完全以其為參照依據。
            <br><br>
            在適用法律允許的最大範圍內，您同意公司不需對由於您使用本網站 (包括此處提及的產品、資料或事件)
            而遭受的損失，向您或任何透過您請求賠償的第三方承擔責任。對於因您使用或無法使用本網站或者網站中斷、暫停或終止而對您或任何第三方造成的任何間接、異常、懲戒性、懲罰性、特殊、偶然或衍生性損害
            (包括業務中斷，資料、收入、利潤、無法使用或其他經濟利益等的損失)，公司概不負責，不管損失是因何而產生，也無論是否違反契約或侵權 (包括過失)，即使公司已被事先告知可能發生這種損害也是如此。
            <br><br>
            8. 一般條款
            雖然公司沒有義務監控您對本網站的使用，但是，如果公司察覺到對於本網站或任何方面有不當使用時，公司可能會作出相對的反應。您確認公司可能會向執法機關報告任何可能被視為非法的行為，以及公司收到這類行為的報告。經要求時，公司會全力配合執法機關對於被指控的網際網路非法活動進行調查。
            <br><br>
            如果您違反本條款，您使用本網站和本網站內容的一切權利會立即終止，恕不另行通知。
            <br><br>
            您同意公司和/或其供應商或授權人可以隨時改進和/或變更本網站的內容或其中所描述的產品、服務、程式和價格，而不另行通知；您也同意公司可以隨時修改本條款，而不透過更新此公告通知您。您同意在發布這些修訂之後繼續使用本網站即表示您接受這類修訂條款。您確認公司保有臨時或永久終止本網站和內容、此處提供的服務和產品，而不另行通知，也不對您承擔任何責任的權利。
            <br><br>
            任何與本條款有關的行為均受加台灣法律管轄，而不考慮任何管轄權的法規選擇或衝突。如因本條款和/或您使用本網站所引起或相關的爭議，您無異議同意以台灣台中地方法院為第一審管轄法院。
            <br><br>
            如果具有司法管轄權的法院裁定本條款有任何規定與法律相牴觸，那麼應對這些規定進行解釋以盡可能反映各方的意願，但所有其他條款仍然保有完整的效力和作用。公司未能行使本條款中的任何權利或規定不得構成對此類權利或規定的放棄，除非公司以書面方式確認並同意。本條款包含您與公司之間的完整協議，並取代之前或同期各方就本文中所包含的標的進行的談判、討論或協議
            (如果有的話)。
          </div>
          <div class="flex justify-center mt-5">
            <button @click="closeUserAgreementModal" class="confirm-button">
              確定
            </button>
          </div>
        </n-card>
      </n-modal>


    </div>
    <p class="text-white copyright mt-5 text-center px-5">Copyright © 2023 EverFortune.AI Co., Lt d. All rights reserve
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/user"
import { useRouter } from "vue-router";
import { loginUser, createRandomCode, loginGoogleUser } from "@/apis/authAPI"
import { useMessage } from 'naive-ui';
import ResponsiveLogo from "@/components/ResponsiveLogo.vue";
import { decodeCredential } from 'vue3-google-login';
// icon
import eye from '@/assets/icons/eye.svg'
import eyeClose from '@/assets/icons/eyeClose.svg'

const checkbox = ref(false);
const router = useRouter()
const username = ref('');
const password = ref('');
const message = useMessage();
const showForgetPasswordModal = ref(false);
// const userDetails = ref(null);
const showPassword = ref(false);
const openForgetPasswordModal = () => {
  showForgetPasswordModal.value = true;
};

interface UserData {
  email: string;
  name: string;
}
interface GoogleResponse {
  credential: string;
}

const handlerLogin = async () => {
  if (!checkbox.value) {
    message.error('請先閱讀並同意用戶協議與隱私協議');
    return;
  }

  // 檢查用戶輸入的帳號密碼是否是假設定的帳號密碼
  try {
      const response = await loginUser(username.value, password.value);
      console.log(response)
      if (response.status === 200 && response.data.data.token) {
        const token = response.data.data.token;
        localStorage.setItem("token", token)

        // 使用 API 回傳的 username 或設置一個默認值
        localStorage.setItem('username', username.value)

        const userStore = useUserStore();
        userStore.login(username.value, token, username.value);
        router.push("/scene");
        console.log("登入成功");
      } else {
        message.error('登入過程出現錯誤');
      }
    } catch (error) {
      message.error('登入失敗！帳號或密碼錯誤');
    }  
};




const callback = async (response: GoogleResponse) => {
  const userData = decodeCredential(response.credential) as UserData;
  handlerGoogleLogin(userData);
}

const handlerGoogleLogin = async (userData: UserData) => {
  if (!checkbox.value) {
    message.error('請先閱讀並同意用戶協議與隱私協議');
    return;
  }
  const res_getrandomcode = await createRandomCode();
  // console.log( res)
  const randomCode = res_getrandomcode.data.data.token
  const res_googleuser = await loginGoogleUser(userData.email, userData.name, randomCode)
  console.log(res_googleuser)
  if (res_googleuser.status === 201) {
    const userStore = useUserStore();
    userStore.login(username.value, res_googleuser.data.data.token, userData.name);
    router.push("/scene");
  }
}

const showPrivacyPolicyModal = ref(false);
const showUserAgreementModal = ref(false);

const openPrivacyPolicyModal = () => {
  showPrivacyPolicyModal.value = true;
};

const closePrivacyPolicyModal = () => {
  showPrivacyPolicyModal.value = false;
};

const openUserAgreementModal = () => {
  showUserAgreementModal.value = true;
};

const closeUserAgreementModal = () => {
  showUserAgreementModal.value = false;
};

//密碼隱藏功能
const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

onMounted(() => {
  const checkedStatus = localStorage.getItem('termsAccepted');
  checkbox.value = checkedStatus === 'true';
})

</script>

<style scoped>
/* 隱私modal */
.modal-content {
  width: 90%;
  max-height: 80vh; /* 設定高度為視窗高度的 80% */
  max-width: 855px;
  overflow-y: auto;
}

@media (max-width: 480px) {
  .modal-content {
    max-width: 95%; /* 小屏幕時，寬度稍微增加 */
    max-height: 80vh; /* 小屏幕時，仍保持高度為視窗的 80% */
  }
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 90%; /* 中型屏幕時的寬度 */
    max-height: 80vh; /* 中型屏幕時，高度維持不變 */
  }
}

.modal-body {
  padding: 10px;
  text-align: left;
  white-space: pre-line;
}

/* checkFrom style */
.checkForm input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: white;
  /* 或其他您希望的背景顏色 */
  border: 1px solid var(--text);
  cursor: pointer;
  position: relative;
  transition: .2s ease-in-out;
  max-width: 16px;
  max-height: 16px;
  border-radius: 50%;
}

.checkForm input[type="checkbox"]:checked {
  background: var(--text);
}

.checkForm input[type="checkbox"]:checked::after {
  content: url('@/assets/icons/checkFill.svg');
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.checkForm {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
}

.checkForm span {
  color: var(--text-secondary);
}

@media (max-width: 640px) {
  .checkForm input[type="checkbox"] {
    border-radius: 50%;
  }
}


@media (max-width: 480px) {
  .checkForm {
    text-wrap: nowrap;
  }

  .checkForm span,
  .checkForm button {
    font-size: 12px;
  }
}

@media (max-width: 392px) {
  .checkForm span,
  .checkForm button {
    font-size: 11px;
  }
}

@media (max-width: 330px) {
  .checkForm {
    text-wrap: wrap;
  }
}


@media (max-width: 392px) {
  .checkForm {
    text-wrap: nowrap;
  }
  .checkForm input {
    padding: 6px;
  }
}

@media (max-width: 330px) {
  .checkForm {
    text-wrap: wrap;
  }

  .checkForm input {
    padding: 6px;
  }
}

/* external link style */
.external-link:after {
  display: block;
  left: 0;
  bottom: -10px;
  width: 100%;
  height: 1px;
  background-color: #000;
  content: "";
  transition: width 0.2s;
}

.external-link:hover:after {
  width: 0%;
}

.hover-underline-animation {
  display: inline-block;
  position: relative;
  color: var(--text);
  cursor: pointer;
  font-family: sans-serif;
  font-weight: 400;
  line-height: 1.4;
  transition: 300ms cubic-bezier(.2, .7, .5, 1);
}

.hover-underline-animation:hover {
  color: var(--primary);
}

.hover-underline-animation:after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(1);
  height: 1px;
  bottom: -0px;
  left: 0;
  background: var(--text);
  transform-origin: top left;
  transition: transform 250ms ease-in-out;
  z-index: 2;
}

.hover-underline-animation:hover:after {
  background: var(--primary);
}

.hover-underline-animation:hover:after {
  transform: scaleX(0);
  transform-origin: top right;
}

.login.custom-button {
  width: 100% !important;
}

.confirm-button {
  width: 100%;
  max-width: 240px;
  height: 40px;
  margin: 0 auto;
  /* padding: 12px 20px 12px 20px; */
  border-radius: 4px;
  border: 1px solid var(--primary);
  background-color: var(--background-white);
  transition: .3s ease-in-out;
}

.confirm-button:hover {
  -webkit-box-shadow: 0 0 15px var(--primary-hover2);
  -moz-box-shadow: 0 0 15px var(--primary-hover2);
  box-shadow: 0 0 15px var(--primary-hover2);
}


button.custom-button:hover {
  background-color: #fff;
  -webkit-box-shadow: 0 0 15px var(--primary-hover2);
  -moz-box-shadow: 0 0 15px var(--primary-hover2);
  box-shadow: 0 0 15px var(--primary-hover2);
}

.passwordForget {
  color: var(--text-secondary);
}

.passwordForget:hover {
  color: var(--primary);
}

.passwordForget.hover-underline-animation:after {
  background: var(--text-secondary);
}

.passwordForget.hover-underline-animation:hover:after {
  background: var(--primary);
}</style>
@/apis/authAPI