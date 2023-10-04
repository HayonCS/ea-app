import * as Hexagonal from "atomic-object/hexagonal";

import { SMB } from "smb";

export const SmbPort = Hexagonal.port<SMB, "smb">("smb");
