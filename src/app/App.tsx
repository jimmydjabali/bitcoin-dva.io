import { useState, useEffect } from "react";
import { useStore } from "@bitcoin-dva/hooks";
import { Dashboard, SetupConfig, Modal } from "@bitcoin-dva/components";
import { updateStore, initialStore } from "@bitcoin-dva/config/globalStore";
import { Routes, Route, useNavigate } from "react-router-dom";
import * as S from "./styled";

type ChangelogModalProps = {
  title: string;
  description: React.ReactElement | string;
};

export const App = () => {
  const navigate = useNavigate();
  const [changelogModal, setChangelogModal] =
    useState<ChangelogModalProps | null>(null);
  const { isAppLoaded, isConfigSet, version } = useStore([
    "isAppLoaded",
    "isConfigSet",
    "version"
  ]);

  useEffect(() => {
    const getNumber = (strVersion: string) =>
      Number.parseInt(strVersion.split(".").join(""));
    const parsedInitialVersion = getNumber(initialStore.version);
    const parsedActualVersion = getNumber(version || "0");
    if (parsedActualVersion < parsedInitialVersion && isConfigSet) {
      updateStore({ version: initialStore.version });
      setChangelogModal({
        title: `Version ${initialStore.version} changelog`,
        description: (
          <>
            New features:{" "}
            <S.ChangelogTextList>
              <li>Able to delete your config</li>
              <li>Routes system</li>
              <li>
                Able to compare monthly/weekly results in DCA/DVA comparasion
                modal
              </li>
              <li>Version and changelog system</li>
              <li>Contact and Github repo links</li>
            </S.ChangelogTextList>
          </>
        )
      });
    }
  }, []);

  useEffect(() => {
    navigate(isConfigSet ? "/dashboard" : "/");
  }, [isConfigSet]);

  return isAppLoaded ? (
    <S.AppContainer>
      <Routes>
        <Route path="/" element={<SetupConfig />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <S.InfoContainer isConfigSet={isConfigSet}>
        <S.InfoText
          color={isConfigSet ? "#a4b0be" : "white"}
          href="mailto:bitcoindva.io@gmail.com"
        >
          Contact
        </S.InfoText>
        <S.InfoText
          color={isConfigSet ? "#a4b0be" : "white"}
          href="https://github.com/bitcoin-dva/bitcoin-dva.io"
        >
          Github
        </S.InfoText>
      </S.InfoContainer>
      {changelogModal ? (
        <Modal
          {...changelogModal}
          overlay={{ width: 700 }}
          onClose={() => {
            setChangelogModal(null);
          }}
        />
      ) : null}
    </S.AppContainer>
  ) : null;
};
