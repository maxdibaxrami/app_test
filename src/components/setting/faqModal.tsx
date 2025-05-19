import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useTranslation } from "react-i18next";

export default function FaqModal() {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const { t } = useTranslation();


  const handleOpen = () => {
    onOpen();
  };

  return (
    <>
      <div onClick={() => handleOpen()} className="flex w-full flex-col">
                <p className="text-medium capitalize font-bold">{t('faq')}</p>
                <p className="text-tiny text-default-400">{t('faq_description')}</p>
       </div>
        
      

      <Modal hideCloseButton={true} isOpen={isOpen} size={"full"} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-2xl font-semibold">
  🚀  Face Match — Everything You Can Do
</ModalHeader>

<ModalBody style={{overflow:"scroll"}} className="space-y-8 text-[15px] leading-relaxed">
  {/* Explore Matches */}
  <section>
    <h3 className="text-lg font-semibold mb-2">🔍 Explore Matches</h3>
    <p>
      Dive into a swipeable stream of people curated by our TON-powered matching
      model. Each card shows verified photos, shared interests, and distance
      (never an exact location). Swipe left to pass, right to like, or
      <strong className="font-medium"> up to super-like </strong> for 3×
      visibility. The moment there’s a mutual like, we open a secure chat so you
      can say hello first.
    </p>
  </section>

  {/* Edit & Verify Profile */}
  <section>
    <h3 className="text-lg font-semibold mb-2">🖊️ Edit & Verify Profile</h3>
    <p>
      Keep your profile fresh in a dedicated editor: update photos, reorder your
      media with drag-and-drop, and fine-tune prompts. Add a <em>Verification
      Selfie</em> to earn a blue check — we blur the image server-side after
      facial match so it’s never stored in raw form. Verified profiles get up to
      <strong className="font-medium"> 30% more matches </strong>.
    </p>
  </section>

  {/* Referral / Airdrop system */}
  <section>
    <h3 className="text-lg font-semibold mb-2">💎 Referral & Airdrop Rewards</h3>
    <p>
      Every friend who joins with your link unlocks an instant
      <strong className="font-medium"> 0.5 TON </strong> bonus for you and
      them. Level-up through Bronze, Silver, Gold, and Platinum referral tiers
      to multiply rewards up to 5×. Your dashboard shows real-time counts,
      pending payouts, and a one-click “Re-share” button for socials.
    </p>
  </section>

  {/* Random Chat */}
  <section>
    <h3 className="text-lg font-semibold mb-2">🎲 Random Chat Roulette</h3>
    <p>
      Hit “Start Chat” to connect with a random online user for a timed
      five-minute conversation. Stay anonymous behind an avatar until you both
      tap “Reveal Profile.” Automatic profanity filters and
      <em> machine-translation</em> keep chats safe and inclusive across 100+
      languages.
    </p>
  </section>

  {/* Premium Plans */}
  <section>
    <h3 className="text-lg font-semibold mb-2">💼 Premium Membership</h3>
    <p>
      Upgrade to <strong>Plus</strong> (1 mo), <strong>Pro</strong> (3 mo) or
      <strong> Elite</strong> (12 mo) to undo swipes, boost your profile weekly,
      and see who liked you <em>before</em> you swipe. All plans are billed in
      TON with a two-tap in-app purchase and prorated refunds if you cancel
      early.
    </p>
  </section>

  {/* Safety & Privacy */}
  <section>
    <h3 className="text-lg font-semibold mb-2">🛡️ Safety & Privacy First</h3>
    <p>
      We never expose your exact location or phone number. End-to-end encryption
      protects every chat; AI moderation removes inappropriate content in under
      300 ms. Two-factor login and optional Face ID lock keep stalkers out.
      Delete account any time—your data is purged within 24 hours.
    </p>
  </section>

  {/* TON Wallet */}
  <section>
    <h3 className="text-lg font-semibold mb-2">👛 TON Wallet</h3>
    <p>
      Check live TON balance, view airdrop history, and cash out to your
      external wallet with <strong className="font-medium">zero</strong>
      withdrawal fees. Transfers complete on-chain in ~5 seconds.
    </p>
  </section>
</ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {t("Close")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

