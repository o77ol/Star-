const storageKeys = {
	clients: 'shabakaty-clients',
	deleted: 'shabakaty-deleted-clients',
	settings: 'shabakaty-settings',
	language: 'shabakaty-language',
	workspaces: 'shabakaty-workspaces',
	activeWorkspace: 'shabakaty-active-workspace'
};

const defaultSettings = {
	notifications: true,
	motion: true,
	compact: false,
	currency: 'iqd-usd',
	theme: 'dark'
};
const baseClientStatuses = {
	'SUB-10482': 'active',
	'SUB-10479': 'soon',
	'SUB-10466': 'active',
	'SUB-10451': 'expired'
};

const modal = document.getElementById('modal');
const settingsModal = document.getElementById('settingsModal');
const workspaceModal = document.getElementById('workspaceModal');
const clientForm = document.getElementById('clientForm');
const clientRows = document.getElementById('clientRows');
const searchInput = document.getElementById('searchInput');
const toast = document.getElementById('toast');
let toastTimer;
let clients = loadClients();
let deletedClientIds = loadDeletedClients();
let settings = { ...defaultSettings, ...loadSettings() };
let currentLanguage = localStorage.getItem(storageKeys.language) || 'ar';
let workspaces = loadWorkspaces();
let activeWorkspace = localStorage.getItem(storageKeys.activeWorkspace) || 'main-network';
const monthlySubscriptionData = [
	{ total: 218, active: 164, soon: 18, expired: 36, renewal: '3.1%' },
	{ total: 221, active: 168, soon: 17, expired: 36, renewal: '3.4%' },
	{ total: 224, active: 171, soon: 19, expired: 34, renewal: '3.8%' },
	{ total: 227, active: 174, soon: 20, expired: 33, renewal: '4.0%' },
	{ total: 230, active: 177, soon: 21, expired: 32, renewal: '4.1%' },
	{ total: 233, active: 180, soon: 21, expired: 32, renewal: '4.2%' },
	{ total: 237, active: 183, soon: 22, expired: 32, renewal: '4.3%' },
	{ total: 242, active: 186, soon: 23, expired: 33, renewal: '4.5%' },
	{ total: 248, active: 189, soon: 24, expired: 35, renewal: '4.6%' },
	{ total: 252, active: 194, soon: 25, expired: 33, renewal: '4.8%' },
	{ total: 256, active: 198, soon: 26, expired: 32, renewal: '5.0%' },
	{ total: 260, active: 202, soon: 26, expired: 32, renewal: '5.2%' }
];

const translations = {
	'الرئيسية':'Home','نظرة عامة':'Overview','إدارة':'Management','العملاء':'Customers','الاشتراكات':'Subscriptions','الشبكة والأجهزة':'Network & Devices','النظام':'System','التقارير':'Reports','الإعدادات':'Settings','مساحة العمل':'Workspace','الشبكة الرئيسية':'Main Network','مدير النظام':'System Admin','هل تحتاج مساعدة؟':'Need help?','تواصل مع الدعم الفني':'Contact technical support','لوحة التحكم':'Dashboard','مرحبا':'Hello','إليك ملخص أداء الشبكة والاشتراكات اليوم.':'Here is your network and subscriptions summary.','إضافة عميل جديد':'Add New Customer','＋ إضافة عميل جديد':'＋ Add New Customer','إجمالي العملاء':'Total Customers','الاشتراكات النشطة':'Active Subscriptions','تنتهي خلال 7 أيام':'Expiring in 7 Days','تحتاج إلى متابعة':'Needs follow-up','إيرادات هذا الشهر':'This Month Revenue','مقارنة بالشهر الماضي':'Compared with last month','من أصل':'of','اشتراك':'subscriptions','حتى 18 سبتمبر':'Until September 18','حالة الاشتراكات':'Subscription Status','توزيع الاشتراكات حسب الحالة الحالية':'Current subscription status distribution','هذا الشهر':'This month','نشطة':'Active','تنتهي قريباً':'Expiring soon','منتهية':'Expired','إجمالي':'Total','نسبة التجديد تحسنت':'Renewal rate improved','هذا الشهر':'this month','نشاط الشبكة':'Network Activity','استهلاك البيانات خلال الأسبوع':'Data usage during the week','استهلاك البيانات خلال آخر 7 أيام':'Data usage during the last 7 days','آخر 7 أيام':'Last 7 days','آخر 14 يوم':'Last 14 days','آخر 30 يوم':'Last 30 days','آخر الاشتراكات':'Latest Subscriptions','متابعة حالة اشتراكات العملاء ووقت الانتهاء':'Track customer subscriptions and expiry times','عرض كل العملاء':'View all customers','الكل':'All','تصدير':'Export','العميل':'Customer','الباقة':'Plan','تاريخ البدء':'Start date','وقت الانتهاء':'Expiry date','الحالة':'Status','نشط':'Active','تنتهي قريباً':'Expiring soon','منتهي':'Expired','بحث العملاء':'Customer search','ابحث باسم العميل أو رقم الاشتراك...':'Search by customer name or subscription number...','حذف':'Delete','أدخل بيانات العميل لإنشاء اشتراك جديد.':'Enter customer details to create a new subscription.','اسم العميل':'Customer name','رقم الجوال':'Phone number','تاريخ الانتهاء':'Expiry date','حفظ الاشتراك':'Save subscription','إعدادات الموقع':'Site Settings','خصص طريقة عرض لوحة التحكم والتنبيهات.':'Customize the dashboard and notifications.','التنبيهات':'Notifications','إظهار تنبيه عند قرب انتهاء الاشتراك':'Show alerts when a subscription is near expiry','الحركة السلسة':'Smooth motion','تشغيل الانتقالات والحركات في الواجهة':'Enable interface transitions and animations','عرض مضغوط':'Compact view','تقليل المسافات لعرض بيانات أكثر':'Reduce spacing to show more data','العملة':'Currency','عملة عرض الإيرادات':'Revenue display currency','دينار عراقي + دولار':'Iraqi Dinar + US Dollar','دينار عراقي':'Iraqi Dinar','دولار أمريكي':'US Dollar','حفظ الإعدادات':'Save settings','تم بنجاح':'Success','تم حفظ الإعدادات':'Settings saved','سيتم تطبيق التغييرات مباشرة':'Changes applied immediately','تمت إضافة العميل':'Customer added','تم حذف العميل':'Customer deleted','تم تحديث قائمة الاشتراكات':'Subscription list updated','تم تصدير البيانات':'Data exported','عرض 4 من أصل 248 عميل':'Showing 4 of 248 customers','تمت البرمجة والتطوير بواسطة':'Developed by','للتواصل مع المطور':'Contact developer','يناير 2026':'January 2026','فبراير 2026':'February 2026','مارس 2026':'March 2026','أبريل 2026':'April 2026','مايو 2026':'May 2026','يونيو 2026':'June 2026','يوليو 2026':'July 2026','أغسطس 2026':'August 2026','سبتمبر 2026':'September 2026','أكتوبر 2026':'October 2026','نوفمبر 2026':'November 2026','ديسمبر 2026':'December 2026','مقارنة بالشهر الماضي':'Compared with last month'
};
const reverseTranslations = Object.fromEntries(Object.entries(translations).map(([arabic, english]) => [english, arabic]));

function loadClients() {
	try {
		return JSON.parse(localStorage.getItem(storageKeys.clients)) || [];
	} catch {
		return [];
	}
}

function loadSettings() {
	try {
		return JSON.parse(localStorage.getItem(storageKeys.settings)) || {};
	} catch {
		return {};
	}
}

function loadDeletedClients() {
	try {
		return JSON.parse(localStorage.getItem(storageKeys.deleted)) || [];
	} catch {
		return [];
	}
}

function loadWorkspaces() {
	try {
		return JSON.parse(localStorage.getItem(storageKeys.workspaces)) || [
			{ id: 'main-network', name: 'الشبكة الرئيسية', type: 'network' },
			{ id: 'tower-al-karama', name: 'برج الكرامة', type: 'tower' }
		];
	} catch {
		return [{ id: 'main-network', name: 'الشبكة الرئيسية', type: 'network' }];
	}
}

function saveWorkspaces() {
	localStorage.setItem(storageKeys.workspaces, JSON.stringify(workspaces));
}

function saveClients() {
	localStorage.setItem(storageKeys.clients, JSON.stringify(clients));
}

function saveDeletedClients() {
	localStorage.setItem(storageKeys.deleted, JSON.stringify(deletedClientIds));
}

function saveSettings() {
	localStorage.setItem(storageKeys.settings, JSON.stringify(settings));
}

function renderWorkspaces() {
	const active = workspaces.find(workspace => workspace.id === activeWorkspace) || workspaces[0];
	if (!active) return;
	activeWorkspace = active.id;
	document.getElementById('activeWorkspaceName').textContent = active.name;
	localStorage.setItem(storageKeys.activeWorkspace, activeWorkspace);
	document.getElementById('workspaceList').innerHTML = workspaces.map(workspace => `<button class="workspace-option ${workspace.id === activeWorkspace ? 'selected' : ''}" type="button" data-workspace-id="${escapeHtml(workspace.id)}"><span class="workspace-type-icon">${workspace.type === 'tower' ? '♜' : '⌁'}</span><span><strong>${escapeHtml(workspace.name)}</strong><small>${workspace.type === 'tower' ? 'برج' : 'شبكة'}</small></span>${workspace.id === activeWorkspace ? '<b>✓</b>' : ''}</button>`).join('');
}

function translateText(value) {
	const trimmed = value.trim();
	const dictionary = currentLanguage === 'en' ? translations : reverseTranslations;
	return dictionary[trimmed] ? value.replace(trimmed, dictionary[trimmed]) : value;
}

function translatePage() {
	const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
	const textNodes = [];
	while (walker.nextNode()) textNodes.push(walker.currentNode);
	textNodes.forEach(node => {
		if (node.parentElement.closest('script,style')) return;
		node.nodeValue = translateText(node.nodeValue);
	});
	document.querySelectorAll('[placeholder],[title],[aria-label]').forEach(element => {
		['placeholder', 'title', 'aria-label'].forEach(attribute => {
			if (element.hasAttribute(attribute)) element.setAttribute(attribute, translateText(element.getAttribute(attribute)));
		});
	});
	document.documentElement.lang = currentLanguage;
	document.documentElement.dir = currentLanguage === 'en' ? 'ltr' : 'rtl';
	document.getElementById('languageToggle').textContent = currentLanguage === 'en' ? 'ع' : 'EN';
	document.getElementById('languageToggle').title = currentLanguage === 'en' ? 'العربية' : 'English';
}

function showToast(title, message) {
	document.getElementById('toastTitle').textContent = currentLanguage === 'en' ? translations[title] || title : title;
	document.getElementById('toastMessage').textContent = currentLanguage === 'en' ? translations[message] || message : message;
	toast.classList.add('show');
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function openModal(target) {
	target.hidden = false;
	document.body.classList.add('modal-open');
	const firstInput = target.querySelector('input, select');
	if (firstInput) setTimeout(() => firstInput.focus(), 80);
}

function closeModal(target) {
	target.hidden = true;
	if (modal.hidden && settingsModal.hidden && workspaceModal.hidden) document.body.classList.remove('modal-open');
}

function getStatus(expiry) {
	const daysLeft = Math.ceil((new Date(`${expiry}T23:59:59`) - new Date()) / 86400000);
	if (daysLeft < 0) return { key: 'expired', label: 'منتهي', text: `منذ ${Math.abs(daysLeft)} يوم`, color: 'red-text', statusClass: 'expired-status' };
	if (daysLeft <= 7) return { key: 'soon', label: 'تنتهي قريباً', text: `متبقي ${daysLeft} يوم`, color: 'orange-text', statusClass: 'soon-status' };
	return { key: 'active', label: 'نشط', text: `متبقي ${daysLeft} يوم`, color: 'green-text', statusClass: 'active-status' };
}

function formatDate(value) {
	return new Intl.DateTimeFormat('ar-IQ', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function escapeHtml(value) {
	return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function getInitial(name) {
	return escapeHtml(name.trim().charAt(0) || 'ع');
}

function renderClient(client) {
	const status = getStatus(client.expiry);
	const row = document.createElement('tr');
	row.dataset.status = status.key;
	row.dataset.clientId = client.id;
	row.className = 'new-client-row';
	row.innerHTML = `<td><div class="client-cell"><div class="avatar avatar-cyan">${getInitial(client.name)}</div><div><strong>${escapeHtml(client.name)}</strong><small>${escapeHtml(client.id)} · ${escapeHtml(client.phone)}</small></div></div></td><td><span class="plan-tag">${escapeHtml(client.plan.split(' - ')[0])} <small>${escapeHtml(client.plan.split(' - ')[1] || '')}</small></span></td><td>${formatDate(client.start)}</td><td><strong>${formatDate(client.expiry)}</strong><small class="remaining ${status.color}">${status.text}</small></td><td><span class="status ${status.statusClass}"><i></i>${status.label}</span></td><td><button class="row-menu" title="حذف العميل" data-action="delete">حذف</button></td>`;
	return row;
}

function renderClients() {
	document.querySelectorAll('#clientRows tr[data-client-id]').forEach(row => {
		if (deletedClientIds.includes(row.dataset.clientId) || row.classList.contains('new-client-row')) row.remove();
	});
	clients.slice().reverse().forEach(client => clientRows.prepend(renderClient(client)));
	updateStats();
	applyFilters();
}

function updateStats() {
	const allRows = document.querySelectorAll('#clientRows tr');
	const deletedBaseIds = deletedClientIds.filter(id => baseClientStatuses[id]);
	const total = 248 - deletedBaseIds.length + clients.length;
	const active = 189 - deletedBaseIds.filter(id => baseClientStatuses[id] === 'active').length + clients.filter(client => getStatus(client.expiry).key === 'active').length;
	const soon = 24 - deletedBaseIds.filter(id => baseClientStatuses[id] === 'soon').length + clients.filter(client => getStatus(client.expiry).key === 'soon').length;
	document.getElementById('totalCustomers').textContent = total;
	document.getElementById('activeTotal').textContent = total;
	document.getElementById('activeSubscriptions').textContent = active;
	document.getElementById('soonSubscriptions').textContent = soon;
	document.querySelector('.nav-item[data-view="customers"] b').textContent = total;
	document.querySelector('.filter-button[data-filter="all"] b').textContent = total;
	document.querySelector('.filter-button[data-filter="active"] b').textContent = active;
	document.querySelector('.filter-button[data-filter="soon"] b').textContent = soon;
}

function applyFilters() {
	const term = searchInput.value.trim().toLowerCase();
	const activeFilter = document.querySelector('.filter-button.active').dataset.filter;
	document.querySelectorAll('#clientRows tr').forEach(row => {
		const matchesText = row.textContent.toLowerCase().includes(term);
		const matchesFilter = activeFilter === 'all' || row.dataset.status === activeFilter;
		row.hidden = !(matchesText && matchesFilter);
	});
}

function applySettings() {
	document.body.classList.toggle('compact-mode', settings.compact);
	document.body.classList.toggle('reduced-motion', !settings.motion);
	document.body.classList.toggle('light-theme', settings.theme === 'light');
	document.body.classList.remove('currency-iqd-usd', 'currency-iqd', 'currency-usd');
	document.body.classList.add(`currency-${settings.currency}`);
	document.getElementById('notificationsToggle').checked = settings.notifications;
	document.getElementById('motionToggle').checked = settings.motion;
	document.getElementById('compactToggle').checked = settings.compact;
	document.getElementById('currencySelect').value = settings.currency;
	document.getElementById('themeToggle').textContent = settings.theme === 'light' ? '☾' : '☼';
	document.getElementById('themeToggle').title = settings.theme === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح';
}

function updateSubscriptionMonth() {
	const data = monthlySubscriptionData[Number(document.getElementById('subscriptionMonth').value)];
	const percentages = [data.active, data.soon, data.expired].map(value => Math.round(value / data.total * 100));
	document.getElementById('monthTotal').textContent = data.total;
	document.getElementById('monthActive').textContent = data.active;
	document.getElementById('monthSoon').textContent = data.soon;
	document.getElementById('monthExpired').textContent = data.expired;
	document.getElementById('monthActivePercent').textContent = `${percentages[0]}%`;
	document.getElementById('monthSoonPercent').textContent = `${percentages[1]}%`;
	document.getElementById('monthExpiredPercent').textContent = `${percentages[2]}%`;
	document.getElementById('renewalRate').textContent = data.renewal;
	document.querySelector('.donut').style.background = `conic-gradient(var(--green) 0 ${percentages[0]}%,var(--orange) ${percentages[0]}% ${percentages[0] + percentages[1]}%,var(--red) ${percentages[0] + percentages[1]}% 100%)`;
}

document.getElementById('openModal').addEventListener('click', () => openModal(modal));
document.getElementById('workspaceToggle').addEventListener('click', () => {
	const menu = document.getElementById('workspaceMenu');
	menu.hidden = !menu.hidden;
	document.getElementById('workspaceToggle').setAttribute('aria-expanded', String(!menu.hidden));
});
document.getElementById('addWorkspace').addEventListener('click', () => {
	document.getElementById('workspaceMenu').hidden = true;
	openModal(workspaceModal);
});
document.getElementById('closeWorkspace').addEventListener('click', () => closeModal(workspaceModal));
document.getElementById('workspaceList').addEventListener('click', event => {
	const option = event.target.closest('[data-workspace-id]');
	if (!option) return;
	activeWorkspace = option.dataset.workspaceId;
	renderWorkspaces();
	document.getElementById('workspaceMenu').hidden = true;
	showToast('تم تبديل مساحة العمل', document.getElementById('activeWorkspaceName').textContent);
});
document.getElementById('workspaceForm').addEventListener('submit', event => {
	event.preventDefault();
	const name = document.getElementById('workspaceName').value.trim();
	const type = document.getElementById('workspaceType').value;
	const workspace = { id: `workspace-${Date.now()}`, name, type };
	workspaces.push(workspace);
	activeWorkspace = workspace.id;
	saveWorkspaces();
	renderWorkspaces();
	event.target.reset();
	closeModal(workspaceModal);
	showToast('تمت إضافة مساحة العمل', name);
});
document.getElementById('subscriptionMonth').addEventListener('change', updateSubscriptionMonth);
document.getElementById('activityRange').addEventListener('change', event => {
	const days = event.target.value;
	document.getElementById('activityDescription').textContent = currentLanguage === 'en' ? `Data usage during the last ${days} days` : `استهلاك البيانات خلال آخر ${days} أيام`;
	showToast(currentLanguage === 'en' ? 'Network activity updated' : 'تم تحديث نشاط الشبكة', currentLanguage === 'en' ? `Showing the last ${days} days` : `يتم عرض آخر ${days} أيام`);
});
document.getElementById('themeToggle').addEventListener('click', () => {
	settings.theme = settings.theme === 'light' ? 'dark' : 'light';
	saveSettings();
	applySettings();
	showToast('تم تغيير الإضاءة', settings.theme === 'light' ? 'تم تفعيل الوضع الفاتح' : 'تم تفعيل الوضع الداكن');
});
document.getElementById('languageToggle').addEventListener('click', () => {
	currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
	localStorage.setItem(storageKeys.language, currentLanguage);
	translatePage();
});
document.getElementById('closeModal').addEventListener('click', () => closeModal(modal));
document.getElementById('closeSettings').addEventListener('click', () => closeModal(settingsModal));
[modal, settingsModal, workspaceModal].forEach(dialog => dialog.addEventListener('click', event => {
	if (event.target === dialog) closeModal(dialog);
}));

document.addEventListener('keydown', event => {
	if (event.key === 'Escape') {
		closeModal(modal);
		closeModal(settingsModal);
		closeModal(workspaceModal);
	}
});

clientForm.addEventListener('submit', event => {
	event.preventDefault();
	const formData = new FormData(clientForm);
	const start = new Date().toISOString().slice(0, 10);
	const client = {
		id: `SUB-${10483 + clients.length}`,
		name: formData.get('name') || clientForm.querySelector('input[type="text"]').value,
		phone: formData.get('phone') || clientForm.querySelector('input[type="tel"]').value,
		plan: formData.get('plan') || clientForm.querySelector('select').value,
		start,
		expiry: formData.get('expiry') || clientForm.querySelector('input[type="date"]').value
	};
	clients.push(client);
	saveClients();
	renderClients();
	closeModal(modal);
	clientForm.reset();
	showToast('تمت إضافة العميل', `تم إنشاء الاشتراك للعميل ${client.name}`);
});

searchInput.addEventListener('input', applyFilters);
document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => {
	document.querySelector('.filter-button.active').classList.remove('active');
	button.classList.add('active');
	applyFilters();
}));

document.querySelectorAll('.nav-item').forEach(item => item.addEventListener('click', () => {
	document.querySelector('.nav-item.active').classList.remove('active');
	item.classList.add('active');
	document.querySelector('.breadcrumb strong').textContent = item.textContent.trim();
	if (item.dataset.view === 'settings') openModal(settingsModal);
	if (item.dataset.view === 'customers' || item.dataset.view === 'subscriptions') document.querySelector('.clients-panel').scrollIntoView({ behavior: settings.motion ? 'smooth' : 'auto' });
}));

document.getElementById('showAll').addEventListener('click', () => document.querySelector('.clients-panel').scrollIntoView({ behavior: settings.motion ? 'smooth' : 'auto' }));
document.getElementById('exportClients').addEventListener('click', () => {
	const rows = [...document.querySelectorAll('#clientRows tr:not([hidden])')];
	const lines = [['العميل', 'رقم الاشتراك', 'الباقة', 'تاريخ البدء', 'وقت الانتهاء', 'الحالة']];
	rows.forEach(row => {
		const cells = [...row.querySelectorAll('td')];
		if (cells.length < 5) return;
		lines.push([
			cells[0].querySelector('strong')?.textContent.trim() || '',
			cells[0].querySelector('small')?.textContent.split('·')[0].trim() || '',
			cells[1].textContent.trim(),
			cells[2].textContent.trim(),
			cells[3].querySelector('strong')?.textContent.trim() || '',
			cells[4].textContent.trim()
		]);
	});
	const csv = '\ufeff' + lines.map(line => line.map(value => `"${value.replace(/"/g, '""')}"`).join(',')).join('\r\n');
	const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
	const link = document.createElement('a');
	link.href = url;
	link.download = `اشتراكات-شبكتي-${new Date().toISOString().slice(0, 10)}.csv`;
	link.click();
	URL.revokeObjectURL(url);
	showToast('تم تصدير البيانات', `تم تصدير ${rows.length} اشتراك`);
});
document.getElementById('saveSettings').addEventListener('click', () => {
	settings = {
		notifications: document.getElementById('notificationsToggle').checked,
		motion: document.getElementById('motionToggle').checked,
		compact: document.getElementById('compactToggle').checked,
		currency: document.getElementById('currencySelect').value,
		theme: settings.theme
	};
	saveSettings();
	applySettings();
	closeModal(settingsModal);
	showToast('تم حفظ الإعدادات', 'سيتم تطبيق التغييرات مباشرة');
});

document.getElementById('clientRows').addEventListener('click', event => {
	const deleteButton = event.target.closest('[data-action="delete"]');
	if (!deleteButton) return;
	const row = deleteButton.closest('tr');
	const id = row.dataset.clientId;
	if (!id || !confirm('هل تريد حذف هذا العميل؟')) return;
	clients = clients.filter(client => client.id !== id);
	if (!deletedClientIds.includes(id)) deletedClientIds.push(id);
	saveClients();
	saveDeletedClients();
	row.classList.add('row-deleting');
	renderClients();
	showToast('تم حذف العميل', 'تم تحديث قائمة الاشتراكات');
});

applySettings();
renderClients();
updateSubscriptionMonth();
renderWorkspaces();
translatePage();
