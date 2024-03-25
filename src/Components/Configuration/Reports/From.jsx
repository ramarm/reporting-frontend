import {
    Flex,
    Divider,
    Text,
    Dialog,
    DialogContentContainer,
    Button,
    Loader,
    List,
    ListItem,
    Avatar,
    Icon,
} from "monday-ui-react-core";
import {Delete, Email, DropdownChevronUp, DropdownChevronDown} from "monday-ui-react-core/icons";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {deleteEmailAccount, getEmailAccounts} from "../../../Queries/management.js";
import AuthModal from "../../Auth/AuthModal.jsx";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";

function getInitials(text) {
    return text.split(" ").map((n) => n[0]).join("");
}

function FromDialogContent({currentEmailAccount, setSender, refetchEmailAccounts, openAddAccount, emailAccounts}) {
    if (emailAccounts === undefined) {
        return <Loader/>
    }

    function emailAccountComponent(emailAccount) {
        return <Flex justify={Flex.justify.SPACE_BETWEEN} style={{width: "100%"}}>
            <Flex gap={Flex.gaps.SMALL}>
                <Avatar type={emailAccount.picture ? Avatar.types.IMG : Avatar.types.TEXT}
                        size={Avatar.sizes.SMALL}
                        src={emailAccount.picture}
                        text={getInitials(emailAccount.name)}/>
                <Text type={Text.types.TEXT2}>{emailAccount.name}</Text>
            </Flex>
            <Button size={Button.sizes.SMALL}
                    kind={Button.kinds.TERTIARY}
                    onClick={async (e) => {
                        e.stopPropagation();
                        if (currentEmailAccount?.email === emailAccount.email) {
                            setSender();
                        }
                        await deleteEmailAccount({email: emailAccount.email});
                        await refetchEmailAccounts();
                    }}>
                <Icon icon={Delete}/>
            </Button>
        </Flex>
    }

    return <Flex direction={Flex.directions.COLUMN}>
        <List component={List.components.DIV}>
            {emailAccounts.map((emailAccount, index) => <ListItem key={index}
                                                                  onClick={() => setSender(emailAccount.email)}>
                {emailAccountComponent(emailAccount)}
            </ListItem>)}
        </List>
        {emailAccounts.length > 0 && <Divider/>}
        <Button style={{width: "100%"}}
                kind={Button.kinds.TERTIARY}
                size={Button.sizes.SMALL}
                onClick={openAddAccount}>
            Add email account
        </Button>
    </Flex>
}

export default function From({editable, from, updateFrom}) {
    const {user} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

    const {
        data: emailAccounts,
        refetch: refetchEmailAccounts
    } = useQuery({
        queryKey: ["emailAccounts"],
        queryFn: getEmailAccounts
    });

    const emailAccount = emailAccounts?.find((emailAccount) => emailAccount.email === from?.email);

    async function setSender(email) {
        if (editable) {
            if (email) {
                const {data: refetchedEmailAccounts} = await refetchEmailAccounts();
                let account;
                if (email === "__LAST_EMAIL_ACCOUNT__") {
                    account = refetchedEmailAccounts.sort((a, b) => new Date(b.last_update) - new Date(a.last_update))[0];
                } else {
                    account = refetchedEmailAccounts.find((emailAccount) => emailAccount.email === email);
                }
                updateFrom({
                    user_id: Number(user.id),
                    name: account.name,
                    email: account.email
                });
            } else {
                updateFrom(null)
            }
        }
    }

    function generateSender() {
        if (emailAccount) {
            return <Flex gap={Flex.gaps.SMALL}>
                <Avatar type={emailAccount.picture ? Avatar.types.IMG : Avatar.types.TEXT}
                        size={Avatar.sizes.SMALL}
                        src={emailAccount.picture}
                        text={getInitials(emailAccount.name)}/>
                <Text type={Text.types.TEXT2}>{emailAccount.name}</Text>
            </Flex>
        }
        if (!editable) {
            return <Flex gap={Flex.gaps.SMALL}>
                <Text type={Text.types.TEXT2}>{from.email}</Text>
            </Flex>
        }
        return <Flex gap={Flex.gaps.SMALL}>
            <Icon icon={Email} iconSize={20}/>
            <Text type={Text.types.TEXT2}>Select sender account</Text>
        </Flex>
    }

    return [<Flex key="from" gap={Flex.gaps.SMALL} className="form-input" style={{width: "100%"}}>
        <Text type={Text.types.TEXT1} color={Text.colors.SECONDARY}>From</Text>
        <Dialog key="from-dialog" containerSelector="#report-modal"
                content={<DialogContentContainer>
                    <FromDialogContent setSender={setSender}
                                       currentEmailAccount={emailAccount}
                                       refetchEmailAccounts={refetchEmailAccounts}
                                       openAddAccount={() => setIsAddAccountOpen(true)}
                                       emailAccounts={emailAccounts}/>
                </DialogContentContainer>}
                position={Dialog.positions.BOTTOM_START}
                onDialogDidShow={() => setIsDialogOpen(true)}
                onDialogDidHide={() => setIsDialogOpen(false)}
                showTrigger={editable ? [Dialog.hideShowTriggers.CLICK] : []}
                hideTrigger={[Dialog.hideShowTriggers.CLICK, Dialog.hideShowTriggers.CLICK_OUTSIDE, Dialog.hideShowTriggers.CONTENT_CLICK]}>
            <Button size={Button.sizes.SMALL}
                    kind={Button.kinds.TERTIARY}
                    disabled={!editable}
                    rightIcon={isDialogOpen ? DropdownChevronUp : DropdownChevronDown}
                    active={isDialogOpen}>
                {generateSender()}
            </Button>
        </Dialog>
    </Flex>,
        <AuthModal key="add-account-modal" isOpen={isAddAccountOpen}
                   setSender={setSender}
                   closeModal={() => setIsAddAccountOpen(false)}/>
    ]
}